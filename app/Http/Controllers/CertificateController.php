<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Models\Land;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CertificateController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Certificate::with('land');

        // Apply filters
        if ($request->has('nomor_sertifikat') && $request->nomor_sertifikat) {
            $query->where('nomor_sertifikat', 'like', "%{$request->nomor_sertifikat}%");
        }
        if ($request->has('nomor_hak') && $request->nomor_hak) {
            $query->whereHas('land', function ($q) use ($request) {
                $q->where('nomor_hak', 'like', "%{$request->nomor_hak}%");
            });
        }
        if ($request->has('surat_ukur') && $request->surat_ukur) {
            $query->whereHas('land', function ($q) use ($request) {
                $q->where('surat_ukur', 'like', "%{$request->surat_ukur}%");
            });
        }
        if ($request->has('pemilik') && $request->pemilik) {
            $query->whereHas('land', function ($q) use ($request) {
                $q->where('pemilik_pe', 'like', "%{$request->pemilik}%")
                  ->orWhere('pemilik_ak', 'like', "%{$request->pemilik}%");
            });
        }
        if ($request->has('tahun') && $request->tahun) {
            $query->whereHas('land', function ($q) use ($request) {
                $q->where('tahun', $request->tahun);
            });
        }

        $certificates = $query->orderBy('created_at', 'desc')->paginate(20)->withQueryString();

        return Inertia::render('certificate/index', [
            'certificates' => $certificates,
            'filters' => $request->only(['nomor_sertifikat', 'nomor_hak', 'surat_ukur', 'pemilik', 'tahun']),
        ]);
    }

    public function create(): Response
    {
        $lands = Land::select('id', 'nomor_hak', 'surat_ukur', 'pemilik_pe', 'kelurahan', 'kecamatan', 'coordinates', 'coordinate')->get();

        return Inertia::render('certificate/create', [
            'lands' => $lands,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'land_id' => 'required|exists:lands,id',
            'nomor_sertifikat' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'file' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120', // 5MB
        ]);

        $file = $request->file('file');
        
        // Sanitize nomor sertifikat untuk nama file
        $sanitizedNomor = preg_replace('/[^a-zA-Z0-9_-]/', '_', $request->nomor_sertifikat);
        $extension = $file->getClientOriginalExtension();
        $fileName = $sanitizedNomor . '.' . $extension;
        
        // Store with custom name in private storage
        $path = $file->storeAs('certificates', $fileName, 'local');

        Certificate::create([
            'land_id' => $request->land_id,
            'nomor_sertifikat' => $request->nomor_sertifikat,
            'description' => $request->description,
            'file_path' => $path,
            'file_name' => $fileName,
            'file_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
        ]);

        return redirect()->route('certificate.index')->with('success', 'Certificate uploaded successfully.');
    }

    public function show(Certificate $certificate)
    {
        // Only authenticated users can access
        if (!Auth::check()) {
            abort(403, 'Unauthorized access to certificate.');
        }

        $certificate->load('land');

        // Check if file exists
        if (!Storage::disk('local')->exists($certificate->file_path)) {
            abort(404, 'Certificate file not found.');
        }

        // Return file with proper headers
        return response()->file(
            Storage::disk('local')->path($certificate->file_path),
            [
                'Content-Type' => $certificate->file_type,
                'Content-Disposition' => 'inline; filename="' . $certificate->file_name . '"',
            ]
        );
    }

    public function download(Certificate $certificate)
    {
        // Only authenticated users can download
        if (!Auth::check()) {
            abort(403, 'Unauthorized access to certificate.');
        }

        // Check if file exists
        if (!Storage::disk('local')->exists($certificate->file_path)) {
            abort(404, 'Certificate file not found.');
        }

        // Return file as download
        return response()->download(
            Storage::disk('local')->path($certificate->file_path),
            $certificate->file_name,
            [
                'Content-Type' => $certificate->file_type,
            ]
        );
    }

    public function edit(Request $request, Certificate $certificate): Response
    {
        $lands = Land::select('id', 'nomor_hak', 'surat_ukur', 'pemilik_pe', 'kelurahan', 'kecamatan', 'coordinates', 'coordinate')->get();
        $certificate->load('land');

        return Inertia::render('certificate/edit', [
            'certificate' => $certificate,
            'lands' => $lands,
            'returnFilters' => $request->only(['nomor_sertifikat', 'nomor_hak', 'surat_ukur', 'pemilik', 'tahun']),
        ]);
    }

    public function update(Request $request, Certificate $certificate)
    {
        $request->validate([
            'land_id' => 'required|exists:lands,id',
            'nomor_sertifikat' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'file' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120', // 5MB
        ]);

        $data = [
            'land_id' => $request->land_id,
            'nomor_sertifikat' => $request->nomor_sertifikat,
            'description' => $request->description,
        ];

        if ($request->hasFile('file')) {
            // Delete old file from private storage
            Storage::disk('local')->delete($certificate->file_path);

            $file = $request->file('file');
            
            // Sanitize nomor sertifikat untuk nama file
            $sanitizedNomor = preg_replace('/[^a-zA-Z0-9_-]/', '_', $request->nomor_sertifikat);
            $extension = $file->getClientOriginalExtension();
            $fileName = $sanitizedNomor . '.' . $extension;
            
            // Store with custom name in private storage
            $path = $file->storeAs('certificates', $fileName, 'local');

            $data['file_path'] = $path;
            $data['file_name'] = $fileName;
            $data['file_type'] = $file->getMimeType();
            $data['file_size'] = $file->getSize();
        }

        $certificate->update($data);

        // Extract filters from return_filter_* params
        $returnParams = [];
        foreach ($request->all() as $key => $value) {
            if (str_starts_with($key, 'return_filter_') && $value) {
                $filterKey = str_replace('return_filter_', '', $key);
                $returnParams[$filterKey] = $value;
            }
        }

        return redirect()->route('certificate.index', $returnParams)->with('success', 'Certificate updated successfully.');
    }

    public function destroy(Certificate $certificate)
    {
        // Delete file from private storage
        Storage::disk('local')->delete($certificate->file_path);
        
        $certificate->delete();

        return redirect()->route('certificate.index')->with('success', 'Certificate deleted successfully.');
    }
}
