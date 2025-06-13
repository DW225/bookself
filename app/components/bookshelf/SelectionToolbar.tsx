import { Trash2, Edit, Tag, X } from 'lucide-react';
import { Button } from '~/components/ui/button';

interface SelectionToolbarProps {
  selectedCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkEdit?: () => void;
  onBulkDelete?: () => void;
  onBulkTag?: () => void;
}

export function SelectionToolbar({
  selectedCount,
  onSelectAll,
  onClearSelection,
  onBulkEdit,
  onBulkDelete,
  onBulkTag,
}: SelectionToolbarProps) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between rounded-lg border bg-card p-3 sm:p-4">
      <div className="flex items-center gap-2 sm:gap-4">
        <span className="text-sm font-medium">
          {selectedCount} book{selectedCount !== 1 ? 's' : ''} selected
        </span>
        <Button variant="outline" size="sm" onClick={onSelectAll} className="hidden sm:inline-flex">
          Select All
        </Button>
      </div>
      
      <div className="flex items-center gap-1 sm:gap-2">
        {onBulkTag && (
          <Button variant="outline" size="sm" onClick={onBulkTag} className="px-2 sm:px-3">
            <Tag className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Tag</span>
          </Button>
        )}
        {onBulkEdit && (
          <Button variant="outline" size="sm" onClick={onBulkEdit} className="px-2 sm:px-3">
            <Edit className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
        )}
        {onBulkDelete && (
          <Button variant="outline" size="sm" onClick={onBulkDelete} className="px-2 sm:px-3">
            <Trash2 className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={onClearSelection} className="px-2">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}