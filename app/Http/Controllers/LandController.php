<?php

namespace App\Http\Controllers;

use App\Models\CustomFieldDefinition;
use App\Models\Land;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LandController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Land::with('certificates');

        // Apply filters
        if ($request->has('nomor_hak') && $request->nomor_hak) {
            $query->where('nomor_hak', 'like', "%{$request->nomor_hak}%");
        }
        if ($request->has('surat_ukur') && $request->surat_ukur) {
            $query->where('surat_ukur', 'like', "%{$request->surat_ukur}%");
        }
        if ($request->has('pemilik') && $request->pemilik) {
            $query->where(function ($q) use ($request) {
                $q->where('pemilik_pe', 'like', "%{$request->pemilik}%")
                  ->orWhere('pemilik_ak', 'like', "%{$request->pemilik}%");
            });
        }
        if ($request->has('kecamatan') && $request->kecamatan) {
            $query->where('kecamatan', $request->kecamatan);
        }
        if ($request->has('kelurahan') && $request->kelurahan) {
            $query->where('kelurahan', $request->kelurahan);
        }
        if ($request->has('tipe_hak') && $request->tipe_hak) {
            $query->where('tipe_hak', 'like', "%{$request->tipe_hak}%");
        }
        if ($request->has('tahun') && $request->tahun) {
            $query->where('tahun', $request->tahun);
        }

        $lands = $query->orderBy('kecamatan', 'asc')->orderBy('kelurahan', 'asc')->paginate(10)->withQueryString();

        // Get kelurahan list for selected kecamatan
        $kelurahanList = [];
        if ($request->has('kecamatan') && $request->kecamatan) {
            $kelurahanList = Land::where('kecamatan', $request->kecamatan)
                ->whereNotNull('kelurahan')
                ->where('kelurahan', '!=', '')
                ->distinct()
                ->orderBy('kelurahan')
                ->pluck('kelurahan')
                ->toArray();
        }

        // Get custom fields visible in list
        $customFields = CustomFieldDefinition::active()
            ->visibleInList()
            ->ordered()
            ->get();

        return Inertia::render('land/index', [
            'lands' => $lands,
            'filters' => $request->only(['nomor_hak', 'surat_ukur', 'pemilik', 'kecamatan', 'kelurahan', 'tipe_hak', 'tahun']),
            'kelurahanList' => $kelurahanList,
            'customFields' => $customFields,
        ]);
    }

    public function create(): Response
    {
        // Get all active custom fields
        $customFields = CustomFieldDefinition::active()
            ->ordered()
            ->get();

        return Inertia::render('land/create', [
            'customFields' => $customFields,
        ]);
    }

    public function store(Request $request)
    {
        // Parse JSON strings to arrays
        if (is_string($request->coordinates)) {
            $request->merge(['coordinates' => json_decode($request->coordinates, true)]);
        }
        if (is_string($request->coordinate)) {
            $request->merge(['coordinate' => json_decode($request->coordinate, true)]);
        }

        $rules = [
            'kode_wilayah' => 'nullable|string|max:255',
            'kecamatan' => 'nullable|string|max:255',
            'kelurahan' => 'nullable|string|max:255',
            'tipe_hak' => 'nullable|string|max:255',
            'tahun' => 'nullable|integer',
            'nib' => 'nullable|string|max:255',
            'penggunaan' => 'nullable|string|max:255',
            'nomor_hak' => 'nullable|string|max:255',
            'surat_ukur' => 'nullable|string|max:255',
            'luas' => 'nullable|numeric',
            'produk' => 'nullable|string|max:255',
            'luas_peta' => 'nullable|numeric',
            'kw' => 'nullable|string|max:255',
            'pemilik_pe' => 'nullable|string|max:255',
            'pemilik_ak' => 'nullable|string|max:255',
            'coordinates' => 'nullable|array',
            'coordinates.*' => 'array|size:2',
            'coordinate' => 'nullable|array|size:2',
            'additional_data' => 'nullable|array',
        ];

        // Add dynamic validation rules for custom fields
        $customFields = CustomFieldDefinition::active()->get();
        foreach ($customFields as $field) {
            $fieldRule = $field->is_required ? 'required' : 'nullable';
            
            switch ($field->field_type) {
                case 'number':
                    $fieldRule .= '|numeric';
                    break;
                case 'date':
                    $fieldRule .= '|date';
                    break;
                case 'checkbox':
                    $fieldRule .= '|array';
                    break;
                default:
                    $fieldRule .= '|string';
            }
            
            $rules["additional_data.{$field->field_key}"] = $fieldRule;
        }

        $validated = $request->validate($rules);

        Land::create($validated);

        return redirect()->route('land.index')->with('success', 'Land data created successfully.');
    }

    public function show(Land $land): Response
    {
        $land->load('certificates');

        return Inertia::render('land/show', [
            'land' => $land,
        ]);
    }

    public function edit(Request $request, Land $land): Response
    {
        // Get all active custom fields
        $customFields = CustomFieldDefinition::active()
            ->ordered()
            ->get();

        return Inertia::render('land/edit', [
            'land' => $land,
            'customFields' => $customFields,
            'returnFilters' => $request->only(['nomor_hak', 'surat_ukur', 'pemilik', 'kecamatan', 'kelurahan', 'tipe_hak', 'tahun']),
        ]);
    }

    public function update(Request $request, Land $land)
    {
        // Parse JSON strings to arrays
        if (is_string($request->coordinates)) {
            $request->merge(['coordinates' => json_decode($request->coordinates, true)]);
        }
        if (is_string($request->coordinate)) {
            $request->merge(['coordinate' => json_decode($request->coordinate, true)]);
        }

        $rules = [
            'kode_wilayah' => 'nullable|string|max:255',
            'kecamatan' => 'nullable|string|max:255',
            'kelurahan' => 'nullable|string|max:255',
            'tipe_hak' => 'nullable|string|max:255',
            'tahun' => 'nullable|integer',
            'nib' => 'nullable|string|max:255',
            'penggunaan' => 'nullable|string|max:255',
            'nomor_hak' => 'nullable|string|max:255|unique:lands,nomor_hak,'.$land->id,
            'surat_ukur' => 'nullable|string|max:255',
            'luas' => 'nullable|numeric',
            'produk' => 'nullable|string|max:255',
            'luas_peta' => 'nullable|numeric',
            'kw' => 'nullable|string|max:255',
            'pemilik_pe' => 'nullable|string|max:255',
            'pemilik_ak' => 'nullable|string|max:255',
            'coordinates' => 'nullable|array',
            'coordinates.*' => 'array|size:2',
            'coordinate' => 'nullable|array|size:2',
            'additional_data' => 'nullable|array',
        ];

        // Add dynamic validation rules for custom fields
        $customFields = CustomFieldDefinition::active()->get();
        foreach ($customFields as $field) {
            $fieldRule = $field->is_required ? 'required' : 'nullable';
            
            switch ($field->field_type) {
                case 'number':
                    $fieldRule .= '|numeric';
                    break;
                case 'date':
                    $fieldRule .= '|date';
                    break;
                case 'checkbox':
                    $fieldRule .= '|array';
                    break;
                default:
                    $fieldRule .= '|string';
            }
            
            $rules["additional_data.{$field->field_key}"] = $fieldRule;
        }

        $validated = $request->validate($rules);

        $land->update($validated);

        // Extract filters from return_filter_* params
        $returnParams = [];
        foreach ($request->all() as $key => $value) {
            if (str_starts_with($key, 'return_filter_') && $value) {
                $filterKey = str_replace('return_filter_', '', $key);
                $returnParams[$filterKey] = $value;
            }
        }
        
        return redirect()->route('land.index', $returnParams)->with('success', 'Land data updated successfully.');
    }

    public function destroy(Land $land)
    {
        $land->delete();

        return redirect()->route('land.index')->with('success', 'Land data deleted successfully.');
    }
}
