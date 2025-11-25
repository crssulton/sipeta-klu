<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Models\Land;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class LandCertificateController extends Controller
{
    public function index(Land $land): Response
    {
        $certificates = Certificate::where('land_id', $land->id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('land/certificates/index', [
            'land' => $land,
            'certificates' => $certificates,
        ]);
    }

    public function create(Land $land): Response
    {
        return Inertia::render('land/certificates/create', [
            'land' => $land,
        ]);
    }

    public function store(Request $request, Land $land)
    {
        $request->validate([
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
            'land_id' => $land->id,
            'nomor_sertifikat' => $request->nomor_sertifikat,
            'description' => $request->description,
            'file_path' => $path,
            'file_name' => $fileName,
            'file_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
        ]);

        return redirect()->route('land.certificates.index', $land)->with('success', 'Certificate uploaded successfully.');
    }

    public function edit(Land $land, Certificate $certificate): Response
    {
        // Ensure certificate belongs to this land
        if ($certificate->land_id !== $land->id) {
            abort(404);
        }

        return Inertia::render('land/certificates/edit', [
            'land' => $land,
            'certificate' => $certificate,
        ]);
    }

    public function update(Request $request, Land $land, Certificate $certificate)
    {
        // Ensure certificate belongs to this land
        if ($certificate->land_id !== $land->id) {
            abort(404);
        }

        $request->validate([
            'nomor_sertifikat' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'file' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120', // 5MB
        ]);

        $data = [
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

        return redirect()->route('land.certificates.index', $land)->with('success', 'Certificate updated successfully.');
    }

    public function destroy(Land $land, Certificate $certificate)
    {
        // Ensure certificate belongs to this land
        if ($certificate->land_id !== $land->id) {
            abort(404);
        }

        // Delete from private storage
        Storage::disk('local')->delete($certificate->file_path);
        $certificate->delete();

        return redirect()->route('land.certificates.index', $land)->with('success', 'Certificate deleted successfully.');
    }
}
