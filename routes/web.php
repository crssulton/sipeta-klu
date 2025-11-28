<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\CustomFieldDefinitionController;
use App\Http\Controllers\LandCertificateController;
use App\Http\Controllers\LandController;
use App\Models\Certificate;
use App\Models\Land;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('/main-menu', function () {
    return Inertia::render('main-menu');
})->name('main-menu');


Route::get('/pencarian-batas-administrasi', function () {
    return Inertia::render('pencarian-batas-administrasi');
})->name('pencarian.batas-administrasi');

Route::get('/brankas-elektronik', function () {
    return Inertia::render('brankas-elektronik');
})->name('brankas-elektronik');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $totalLands = Land::count();
        $totalCertificates = Certificate::count();
        $totalAdmins = null;
        
        /** @var User $user */
        $user = Auth::user();
        if ($user->role === \App\RoleEnum::SUPER_ADMIN) {
            $totalAdmins = User::count();
        }
        
        return Inertia::render('dashboard', [
            'totalLands' => $totalLands,
            'totalCertificates' => $totalCertificates,
            'totalAdmins' => $totalAdmins,
        ]);
    })->name('dashboard');

    // Pencarian Bidang Tanah - Requires authentication
    Route::get('/pencarian-bidang-tanah', function () {
        $nomorSertifikat = request('nomor_sertifikat');
        $namaPemilik = request('nama_pemilik');
        $lokasi = request('lokasi');
        
        // Ambil semua lands dengan coordinates yang valid
        $lands = Land::with('certificates')
            ->whereNotNull('coordinates')
            ->whereNotNull('coordinate')
            ->get()
            ->map(function ($land) {
                // Force reload additional_data to ensure it's included
                $additionalData = $land->additional_data;
                
                $mapped = [
                    'id' => $land->id,
                    'nomor_hak' => $land->nomor_hak,
                    'pemilik_pe' => $land->pemilik_pe,
                    'pemilik_ak' => $land->pemilik_ak,
                    'kelurahan' => $land->kelurahan,
                    'kecamatan' => $land->kecamatan,
                    'luas' => $land->luas,
                    'tipe_hak' => $land->tipe_hak,
                    'coordinates' => is_string($land->coordinates) ? json_decode($land->coordinates) : $land->coordinates,
                    'coordinate' => is_string($land->coordinate) ? json_decode($land->coordinate) : $land->coordinate,
                    'certificates' => $land->certificates,
                    'additional_data' => $additionalData,
                ];
                
                return $mapped;
            });
        
        // Get custom fields visible in detail
        $customFields = \App\Models\CustomFieldDefinition::active()
            ->visibleInDetail()
            ->ordered()
            ->get();
        
        return Inertia::render('pencarian-bidang-tanah', [
            'lands' => $lands,
            'customFields' => $customFields,
            'filters' => [
                'nomor_sertifikat' => $nomorSertifikat,
                'nama_pemilik' => $namaPemilik,
                'lokasi' => $lokasi,
            ],
        ]);
    })->name('pencarian.bidang-tanah');

    // Admin Management - Super Admin Only
    Route::middleware(['super_admin'])->group(function () {
        Route::get('/admin', [AdminController::class, 'index'])->name('admin.index');
        Route::get('/admin/create', [AdminController::class, 'create'])->name('admin.create');
        Route::post('/admin', [AdminController::class, 'store'])->name('admin.store');
        Route::get('/admin/{admin}/edit', [AdminController::class, 'edit'])->name('admin.edit');
        Route::put('/admin/{admin}', [AdminController::class, 'update'])->name('admin.update');
        Route::delete('/admin/{admin}', [AdminController::class, 'destroy'])->name('admin.destroy');
        
        Route::get('/admin/pending', [AdminController::class, 'pending'])->name('admin.pending');
        Route::post('/admin/{admin}/verify', [AdminController::class, 'verify'])->name('admin.verify');
        Route::post('/admin/{admin}/toggle-active', [AdminController::class, 'toggleActive'])->name('admin.toggle-active');
        
        // Change admin password - Super Admin only
        Route::get('/admin/{admin}/change-password', [AdminController::class, 'changeAdminPassword'])->name('admin.change-admin-password');
        Route::put('/admin/{admin}/change-password', [AdminController::class, 'updateAdminPassword'])->name('admin.update-admin-password');
        
        // Custom Fields Management - Super Admin only
        Route::resource('custom-fields', CustomFieldDefinitionController::class)->except(['show']);
        Route::post('/custom-fields/reorder', [CustomFieldDefinitionController::class, 'reorder'])->name('custom-fields.reorder');
    });

    // Change Password - All authenticated users
    Route::get('/admin/change-password', [AdminController::class, 'changePassword'])->name('admin.change-password');
    Route::put('/admin/change-password', [AdminController::class, 'updatePassword'])->name('admin.update-password');

    // Land Management - All verified users
    Route::resource('land', LandController::class);
    
    // Land Certificates - Nested resource
    Route::get('/land/{land}/certificates', [LandCertificateController::class, 'index'])->name('land.certificates.index');
    Route::get('/land/{land}/certificates/create', [LandCertificateController::class, 'create'])->name('land.certificates.create');
    Route::post('/land/{land}/certificates', [LandCertificateController::class, 'store'])->name('land.certificates.store');
    Route::get('/land/{land}/certificates/{certificate}/edit', [LandCertificateController::class, 'edit'])->name('land.certificates.edit');
    Route::put('/land/{land}/certificates/{certificate}', [LandCertificateController::class, 'update'])->name('land.certificates.update');
    Route::delete('/land/{land}/certificates/{certificate}', [LandCertificateController::class, 'destroy'])->name('land.certificates.destroy');

    // Certificate Management - All verified users
    Route::resource('certificate', CertificateController::class);
    Route::get('certificate/{certificate}/download', [CertificateController::class, 'download'])->name('certificate.download');
});

require __DIR__.'/settings.php';
