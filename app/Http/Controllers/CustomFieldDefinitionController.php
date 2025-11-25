<?php

namespace App\Http\Controllers;

use App\Models\CustomFieldDefinition;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomFieldDefinitionController extends Controller
{
    /**
     * Display a listing of custom field definitions.
     */
    public function index(): Response
    {
        $fields = CustomFieldDefinition::query()
            ->orderBy('order')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('land/custom-fields/index', [
            'fields' => $fields,
        ]);
    }

    /**
     * Show the form for creating a new custom field definition.
     */
    public function create(): Response
    {
        return Inertia::render('land/custom-fields/create');
    }

    /**
     * Store a newly created custom field definition.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'field_key' => 'required|string|unique:custom_field_definitions,field_key|regex:/^[a-z_]+$/',
            'field_label' => 'required|string|max:255',
            'field_type' => 'required|in:text,textarea,select,radio,checkbox,number,date',
            'field_options' => 'nullable|array',
            'field_options.*' => 'required|string',
            'is_visible_in_list' => 'boolean',
            'is_visible_in_detail' => 'boolean',
            'is_required' => 'boolean',
            'is_active' => 'boolean',
            'order' => 'nullable|integer|min:0',
        ]);

        // Auto-generate order if not provided
        if (!isset($validated['order'])) {
            $validated['order'] = CustomFieldDefinition::max('order') + 1;
        }

        CustomFieldDefinition::create($validated);

        return redirect()->route('custom-fields.index')
            ->with('success', 'Field berhasil ditambahkan');
    }

    /**
     * Show the form for editing the specified custom field definition.
     */
    public function edit(CustomFieldDefinition $customField): Response
    {
        return Inertia::render('land/custom-fields/edit', [
            'field' => $customField,
        ]);
    }

    /**
     * Update the specified custom field definition.
     */
    public function update(Request $request, CustomFieldDefinition $customField)
    {
        $validated = $request->validate([
            'field_key' => 'required|string|regex:/^[a-z_]+$/|unique:custom_field_definitions,field_key,' . $customField->id,
            'field_label' => 'required|string|max:255',
            'field_type' => 'required|in:text,textarea,select,radio,checkbox,number,date',
            'field_options' => 'nullable|array',
            'field_options.*' => 'required|string',
            'is_visible_in_list' => 'boolean',
            'is_visible_in_detail' => 'boolean',
            'is_required' => 'boolean',
            'is_active' => 'boolean',
            'order' => 'nullable|integer|min:0',
        ]);

        $customField->update($validated);

        return redirect()->route('custom-fields.index')
            ->with('success', 'Field berhasil diperbarui');
    }

    /**
     * Remove the specified custom field definition.
     */
    public function destroy(CustomFieldDefinition $customField)
    {
        $customField->delete();

        return redirect()->route('custom-fields.index')
            ->with('success', 'Field berhasil dihapus');
    }

    /**
     * Update field order (for drag & drop reordering).
     */
    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'orders' => 'required|array',
            'orders.*.id' => 'required|exists:custom_field_definitions,id',
            'orders.*.order' => 'required|integer|min:0',
        ]);

        foreach ($validated['orders'] as $item) {
            CustomFieldDefinition::where('id', $item['id'])
                ->update(['order' => $item['order']]);
        }

        return back()->with('success', 'Urutan field berhasil diperbarui');
    }
}
