import { Checkbox } from "@/components/ui/checkbox";
import {
  CONTENT_CATEGORIES,
  type ContentCategoryId,
  type ContentCategorySelection,
} from "@/data/contentCategories";

export function ContentCategoryFields({
  value,
  onChange,
}: {
  value: ContentCategorySelection;
  onChange: (next: ContentCategorySelection) => void;
}) {
  const toggle = (categoryId: ContentCategoryId, option: string, checked: boolean) => {
    const current = value[categoryId];
    onChange({
      ...value,
      [categoryId]: checked
        ? [...current, option]
        : current.filter((item) => item !== option),
    });
  };

  return (
    <div className="space-y-5" data-org-raw>
      {CONTENT_CATEGORIES.map((category) => (
        <fieldset key={category.id} className="space-y-2">
          <legend className="text-sm font-medium text-foreground">
            {category.label}{" "}
            <span className="text-xs font-normal text-muted-foreground">(optional)</span>
          </legend>
          <div className="flex flex-col gap-2">
            {category.options.map((option) => {
              const id = `content-category-${category.id}-${option}`;
              const selected = value[category.id].includes(option);
              return (
                <label key={option} htmlFor={id} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    id={id}
                    checked={selected}
                    onCheckedChange={(checked) => toggle(category.id, option, checked === true)}
                  />
                  <span className="text-sm text-foreground">{option}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
