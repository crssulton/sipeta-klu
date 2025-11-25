import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CustomFieldDefinition } from '@/types';

interface DynamicFieldProps {
    field: CustomFieldDefinition;
    value?: string | string[] | number | null;
    onChange: (value: string | string[] | number | null) => void;
    error?: string;
}

export function DynamicField({
    field,
    value,
    onChange,
    error,
}: DynamicFieldProps) {
    const renderField = () => {
        switch (field.field_type) {
            case 'text':
                return (
                    <Input
                        id={field.field_key}
                        name={field.field_key}
                        value={(value as string) || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={`Masukkan ${field.field_label}`}
                        required={field.is_required}
                    />
                );

            case 'textarea':
                return (
                    <Textarea
                        id={field.field_key}
                        name={field.field_key}
                        value={(value as string) || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={`Masukkan ${field.field_label}`}
                        required={field.is_required}
                        rows={4}
                    />
                );

            case 'number':
                return (
                    <Input
                        id={field.field_key}
                        name={field.field_key}
                        type="number"
                        value={(value as number) || ''}
                        onChange={(e) =>
                            onChange(
                                e.target.value ? Number(e.target.value) : null,
                            )
                        }
                        placeholder={`Masukkan ${field.field_label}`}
                        required={field.is_required}
                    />
                );

            case 'date':
                return (
                    <Input
                        id={field.field_key}
                        name={field.field_key}
                        type="date"
                        value={
                            value
                                ? typeof value === 'string'
                                    ? value.split('T')[0]
                                    : new Date(value as number).toISOString().split('T')[0]
                                : ''
                        }
                        onChange={(e) => onChange(e.target.value)}
                        required={field.is_required}
                    />
                );

            case 'select':
                return (
                    <Select
                        value={(value as string) || ''}
                        onValueChange={onChange}
                        required={field.is_required}
                    >
                        <SelectTrigger id={field.field_key}>
                            <SelectValue
                                placeholder={`Pilih ${field.field_label}`}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {field.field_options?.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );

            case 'radio':
                return (
                    <div className="space-y-2">
                        {field.field_options?.map((option) => (
                            <div
                                key={option}
                                className="flex items-center space-x-2"
                            >
                                <input
                                    type="radio"
                                    id={`${field.field_key}-${option}`}
                                    name={field.field_key}
                                    value={option}
                                    checked={(value as string) === option}
                                    onChange={(e) => onChange(e.target.value)}
                                    required={field.is_required}
                                    className="h-4 w-4"
                                />
                                <Label htmlFor={`${field.field_key}-${option}`}>
                                    {option}
                                </Label>
                            </div>
                        ))}
                    </div>
                );

            case 'checkbox':
                const checkboxValues = (value as string[]) || [];
                return (
                    <div className="space-y-2">
                        {field.field_options?.map((option) => (
                            <div
                                key={option}
                                className="flex items-center space-x-2"
                            >
                                <Checkbox
                                    id={`${field.field_key}-${option}`}
                                    checked={checkboxValues.includes(option)}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            onChange([
                                                ...checkboxValues,
                                                option,
                                            ]);
                                        } else {
                                            onChange(
                                                checkboxValues.filter(
                                                    (v) => v !== option,
                                                ),
                                            );
                                        }
                                    }}
                                />
                                <Label htmlFor={`${field.field_key}-${option}`}>
                                    {option}
                                </Label>
                            </div>
                        ))}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="space-y-2">
            <Label htmlFor={field.field_key}>
                {field.field_label}
                {field.is_required && (
                    <span className="text-destructive ml-1">*</span>
                )}
            </Label>
            {renderField()}
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}
