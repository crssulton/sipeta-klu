<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomFieldDefinition extends Model
{
    protected $fillable = [
        'field_key',
        'field_label',
        'field_type',
        'field_options',
        'is_visible_in_list',
        'is_visible_in_detail',
        'is_required',
        'is_active',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'field_options' => 'array',
            'is_visible_in_list' => 'boolean',
            'is_visible_in_detail' => 'boolean',
            'is_required' => 'boolean',
            'is_active' => 'boolean',
            'order' => 'integer',
        ];
    }

    /**
     * Scope for active fields
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for fields visible in list
     */
    public function scopeVisibleInList($query)
    {
        return $query->where('is_visible_in_list', true);
    }

    /**
     * Scope for fields visible in detail
     */
    public function scopeVisibleInDetail($query)
    {
        return $query->where('is_visible_in_detail', true);
    }

    /**
     * Scope for ordered fields
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }
}
