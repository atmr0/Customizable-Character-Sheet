import { BaseComponent } from "./BaseComponent";
import { Constants } from "../../constants";

export class ImageField extends BaseComponent {
  type: string = Constants.ImageField;
  accept: string = "image/*";
  maxSizeBytes?: number;
  placeholder?: string;
  value?: string = "";

  public getValue(): string | undefined {
    return this.value;
  }

  public setValue(value: string | undefined) {
    this.value = value;
    if (this.id) this.updateValueStore(this.id, value);
  }

  public async setFromFile(file: File): Promise<void> {
    if (!file) return;
    if (this.maxSizeBytes && file.size > this.maxSizeBytes) {
      return;
    }
    const dataUrl = await this.readFileAsDataURL(file);
    this.setValue(dataUrl);
  }

  private readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }
}

export default ImageField;
