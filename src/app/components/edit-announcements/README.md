# EditAnnouncementsComponent

A reusable Angular/Ionic component for managing vendor announcements with full CRUD functionality, styled to match the customer discounts component.

## Features

- ✅ Display up to 3 vendor announcements
- ✅ Add new announcements with title and body (max 300 characters)
- ✅ Edit existing announcements
- ✅ Delete announcements with confirmation
- ✅ Form validation with error messages
- ✅ Character count display
- ✅ Auto-save functionality
- ✅ Toast notifications for success/error states
- ✅ Responsive design for mobile and desktop
- ✅ Loading states and disabled buttons during API calls
- ✅ Consistent styling with customer discounts component

## Usage

### In Vendor Settings Page
The component is positioned above the customer discounts section:
```html
<div>
  <ion-row>
    <ion-col>
      <h2>My Announcements</h2>
    </ion-col>
  </ion-row>
  <ion-row>
    <ion-col size="7">
      <app-edit-announcements [vendor]="vendor"></app-edit-announcements>
    </ion-col>
  </ion-row>
</div>
```

### Input Properties
- `vendor: VendorProfile` - The vendor profile object containing the vendor ID

## Design Consistency

This component follows the exact same design patterns as the customer discounts component:

### Styling Features
- **External Title**: Title (`<h2>My Announcements</h2>`) is positioned outside the card
- **Card Styling**: Uses the same border radius, shadows, and padding as customer discounts
- **Edit Icon**: Positioned consistently in top-right corner with same styling
- **Form Layout**: Uses the same grid system with offset columns and icon placement
- **Action Buttons**: Styled identically with same spacing and button types
- **Color Scheme**: Uses the same CSS variables and color patterns

### Layout Structure
- **View Mode**: Displays existing announcements with edit icon overlay
- **Edit Mode**: Form with input fields, action buttons, and validation
- **Icons**: Add/delete icons positioned consistently with customer discounts
- **Responsive**: Same column sizing (`size="7"`) and mobile adaptations

## API Integration

The component uses the following auto-generated API methods:
- `get(GetVendorAnnouncementsRequest)` - Fetches announcements for a vendor
- `add(AddVendorAnnouncementRequest)` - Creates a new announcement
- `update(UpdateVendorAnnouncementRequest)` - Updates an existing announcement
- `delete(DeleteVendorAnnouncementRequest)` - Deletes an announcement

## Component Structure

### Files
- `edit-announcements.component.ts` - Main component logic
- `edit-announcements.component.html` - Template matching customer discounts structure
- `edit-announcements.component.scss` - SCSS importing same theme variables as customer discounts

### Key Methods
- `loadAnnouncements()` - Fetches announcements from API
- `addAnnouncement()` - Adds a new form group for announcement
- `removeAnnouncement(index)` - Removes announcement (with API call if existing)
- `saveAnnouncements()` - Saves all changes to API
- `toggleEditMode()` - Switches between view and edit modes

## Validation Rules

- **Title**: Required, max 100 characters
- **Body**: Required, max 300 characters
- **Maximum**: 3 announcements per vendor

## Implementation Notes

### Customer Discounts Pattern Matching
This component precisely follows the customer discounts architectural pattern:
- **SCSS Imports**: Uses same theme imports (`@import 'src/theme/jacobi-theme/scss/main'`)
- **CSS Variables**: Leverages identical color and spacing variables
- **Form Arrays**: Same dynamic content management approach
- **Toggle Modes**: Identical view/edit mode switching
- **Icon Styling**: Consistent icon sizes, colors, and positioning
- **Button Layout**: Same action button wrapper and spacing

### Error Handling
- API errors are caught and displayed as toast messages
- Form validation prevents invalid submissions
- Loading states prevent multiple concurrent API calls

### Dependencies
- `FormBuilder`, `FormArray`, `Validators` from Angular Forms
- `ToastController` from Ionic Angular
- `NeatBoutiqueApiService` for API calls
- Various request/response classes from the auto-generated API service

### Module Registration
The component is registered in `SharedModule` for use across the application.

## Position in Vendor Settings

The announcements section is strategically placed:
1. **After**: Bio section
2. **Before**: Customer discounts section
3. **Layout**: Same grid structure with `size="7"` column width

This positioning provides logical flow for vendors managing their profile information.

## Future Enhancements

- Rich text editing for announcement body
- Image attachments
- Scheduling announcements for future publication
- Analytics on announcement views
- Push notifications for new announcements 