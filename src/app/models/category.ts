
export class Category {
    name: string;
    icon: string;
    hexColor: string;
    categoryLink: string;
    isSelected: boolean;
    
    constructor({ name, icon, hexColor, categoryLink, isSelected }) {
      this.name = name;
      this.icon = icon;
      this.hexColor = hexColor;
      this.categoryLink = categoryLink;
      this.isSelected = isSelected;
    }
  }