import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

function CommonForm({
  formControls = [],
  formData = {},
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled = false,
}) {
  function handleChange(name, value) {
    if (typeof setFormData !== "function") return;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function renderInputsByComponentType(getControlItem) {
    const value = formData?.[getControlItem.name] ?? "";

    switch (getControlItem.componentType) {
      case "input":
        return (
          <Input
            id={getControlItem.name}
            name={getControlItem.name}
            type={getControlItem.type}
            placeholder={getControlItem.placeholder}
            value={value}
            required={getControlItem.required}
            onChange={(e) => handleChange(getControlItem.name, e.target.value)}
          />
        );

      case "select":
        return (
          <Select
            value={value}
            onValueChange={(val) => handleChange(getControlItem.name, val)}
          >
            <SelectTrigger className="w-full" id={getControlItem.name}>
              <SelectValue placeholder={`Select ${getControlItem.label}`} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options?.map((optionItem) => (
                <SelectItem key={optionItem.id} value={optionItem.id}>
                  {optionItem.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "textarea":
        return (
          <Textarea
            id={getControlItem.name}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            value={value}
            required={getControlItem.required}
            onChange={(e) => handleChange(getControlItem.name, e.target.value)}
          />
        );

      default:
        return (
          <Input
            id={getControlItem.name}
            name={getControlItem.name}
            type={getControlItem.type}
            placeholder={getControlItem.placeholder}
            value={value}
            required={getControlItem.required}
            onChange={(e) => handleChange(getControlItem.name, e.target.value)}
          />
        );
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div key={controlItem.name} className="grid w-full gap-1.5">
            <Label htmlFor={controlItem.name} className="mb-1">
              {controlItem.label}
            </Label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>

      <Button type="submit" disabled={isBtnDisabled} className="mt-2 w-full cursor-pointer">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;
