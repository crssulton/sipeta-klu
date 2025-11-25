<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\RoleEnum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::query();

        // Filter by status
        if ($request->has('status')) {
            if ($request->status === 'pending') {
                $query->where('is_verified', false);
            } elseif ($request->status === 'verified') {
                $query->where('is_verified', true)->where('is_active', true);
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            } elseif ($request->status === 'admin') {
                $query->where('role', RoleEnum::ADMIN)
                      ->orWhere('role', RoleEnum::SUPER_ADMIN);
            }
        }

        // Search filter
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $admins = $query->orderBy('created_at', 'desc')->paginate(15)->withQueryString();

        return Inertia::render('admin/index', [
            'admins' => $admins,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|in:admin,super_admin',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'is_verified' => true,
            'is_active' => true,
        ]);

        return redirect()->route('admin.index')->with('success', 'Admin created successfully.');
    }

    public function edit(Request $request, User $admin): Response
    {
        return Inertia::render('admin/edit', [
            'admin' => $admin,
            'returnFilters' => $request->only(['search', 'status']),
        ]);
    }

    public function update(Request $request, User $admin)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users,email,'.$admin->id,
            'role' => 'required|in:admin,super_admin',
        ]);

        $admin->update([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
        ]);

        // Extract filters from return_filter_* params
        $returnParams = [];
        foreach ($request->all() as $key => $value) {
            if (str_starts_with($key, 'return_filter_') && $value) {
                $filterKey = str_replace('return_filter_', '', $key);
                $returnParams[$filterKey] = $value;
            }
        }

        return redirect()->route('admin.index', $returnParams)->with('success', 'Admin updated successfully.');
    }

    public function destroy(User $admin)
    {
        if ($admin->id === Auth::id()) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        $admin->delete();

        return redirect()->route('admin.index')->with('success', 'Admin deleted successfully.');
    }

    public function pending(): Response
    {
        $pendingAdmins = User::where('is_verified', false)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('admin/pending', [
            'pendingAdmins' => $pendingAdmins,
        ]);
    }

    public function verify(User $admin)
    {
        $admin->update([
            'is_verified' => true,
            'is_active' => true,
        ]);

        return back()->with('success', 'User berhasil diverifikasi dan diaktifkan.');
    }

    public function toggleActive(User $admin)
    {
        if ($admin->id === Auth::id()) {
            return back()->with('error', 'Anda tidak dapat menonaktifkan akun sendiri.');
        }

        $admin->update(['is_active' => !$admin->is_active]);

        $status = $admin->is_active ? 'diaktifkan' : 'dinonaktifkan';
        return back()->with('success', "User berhasil {$status}.");
    }

    public function changePassword(): Response
    {
        return Inertia::render('admin/change-password');
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $request->user()->update([
            'password' => Hash::make($request->password),
        ]);

        return back()->with('success', 'Password changed successfully.');
    }

    public function changeAdminPassword(User $admin): Response
    {
        /** @var User $currentUser */
        $currentUser = Auth::user();
        
        if ($admin->role === RoleEnum::SUPER_ADMIN && $currentUser->id !== $admin->id) {
            abort(403, 'You cannot change another super admin password.');
        }

        return Inertia::render('admin/change-admin-password', [
            'admin' => $admin,
        ]);
    }

    public function updateAdminPassword(Request $request, User $admin)
    {
        /** @var User $currentUser */
        $currentUser = Auth::user();
        
        if ($admin->role === RoleEnum::SUPER_ADMIN && $currentUser->id !== $admin->id) {
            abort(403, 'You cannot change another super admin password.');
        }

        $request->validate([
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $admin->update([
            'password' => Hash::make($request->password),
        ]);

        return redirect()->route('admin.index')->with('success', 'Admin password changed successfully.');
    }
}
