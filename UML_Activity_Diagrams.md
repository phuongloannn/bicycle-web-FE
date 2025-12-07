# UML Activity Diagrams - Bicycle Management System

This document contains Activity Diagrams for key functionalities of the Bicycle Management System.

---

## Activity Diagram Components

| Component | Symbol | Function |
|-----------|--------|----------|
| Initial Node | ● (black circle) | Start |
| Activity Node | ▭ (rounded rectangle) | An action |
| Decision Node | ⬟ (diamond) | Branch Yes/No |
| Flow Arrow | → | Activity flow direction |
| Final Node | ⊙ (circle with border) | End |
| Swimlane | Vertical column | Divide responsibility (Admin vs System) |
| Activity Diagram Frame | Frame | Enclose entire process |

---

## 1. Import Inventory by CSV File

```mermaid
stateDiagram-v2
    state "IMPORT INVENTORY BY CSV FILE" as frame {
        state "Admin" as admin_col {
            [*] --> SelectFile: ●
            SelectFile --> UploadCSV: Select CSV file from computer
            UploadCSV --> ClickImport: Click "Import" button
            ClickImport --> [*]
            
            state DisplayResult <<choice>>
            DisplayResult --> ShowSuccess: Success
            DisplayResult --> ShowError: Error
            ShowSuccess --> [*]: Display "Import successful"
            ShowError --> [*]: Display error message
        }
        
        state "System" as system_col {
            state ValidateFile <<choice>>
            state ValidateData <<choice>>
            state ProcessRows <<choice>>
            
            ClickImport --> ReceiveFile: Receive CSV file
            ReceiveFile --> ValidateFile: Validate file format
            
            ValidateFile --> ValidateData: Valid
            ValidateFile --> ReturnError1: Invalid
            ReturnError1 --> DisplayResult: Return error response
            
            ValidateData --> CheckHeaders: Check CSV headers
            CheckHeaders --> ProcessRows: Headers valid
            CheckHeaders --> ReturnError2: Headers invalid
            ReturnError2 --> DisplayResult
            
            ProcessRows --> LoopRows: Loop through each row
            LoopRows --> ValidateRow: Validate row data
            
            state ValidateRow <<choice>>
            ValidateRow --> CheckSKU: Valid
            ValidateRow --> LogError: Invalid - Skip row
            
            CheckSKU --> UpdateDB: SKU exists - UPDATE
            CheckSKU --> InsertDB: SKU not exists - INSERT
            
            UpdateDB --> NextRow
            InsertDB --> NextRow
            LogError --> NextRow
            
            NextRow --> MoreRows: More rows?
            
            state MoreRows <<choice>>
            MoreRows --> LoopRows: Yes
            MoreRows --> ReturnSuccess: No
            
            ReturnSuccess --> DisplayResult: Return success response
        }
    }
```

---

## 2. Export Inventory by CSV File

```mermaid
stateDiagram-v2
    state "EXPORT INVENTORY BY CSV FILE" as frame {
        state "Admin" as admin_col {
            [*] --> OpenPage: ●
            OpenPage --> ApplyFilters: Open Inventory page
            ApplyFilters --> ClickExport: Apply filters (optional)
            ClickExport --> [*]: Click "Export CSV" button
            
            state DisplayResult <<choice>>
            DisplayResult --> DownloadFile: Success
            DisplayResult --> ShowError: Error
            DownloadFile --> [*]: Download CSV file
            ShowError --> [*]: Display error message
        }
        
        state "System" as system_col {
            state CheckData <<choice>>
            state GenerateCSV <<choice>>
            
            ClickExport --> QueryData: Query inventory data
            QueryData --> CheckData: Check if data exists
            
            CheckData --> ConvertCSV: Data exists
            CheckData --> ReturnNoData: No data
            ReturnNoData --> DisplayResult: Return "No data" response
            
            ConvertCSV --> AddHeaders: Convert data to CSV format
            AddHeaders --> FormatRows: Add CSV headers
            FormatRows --> EncodeUTF8: Format data rows
            EncodeUTF8 --> GenerateCSV: Encode as UTF-8
            
            GenerateCSV --> ReturnFile: Success
            GenerateCSV --> ReturnError: Error
            
            ReturnFile --> DisplayResult: Return CSV file
            ReturnError --> DisplayResult: Return error response
        }
    }
```

---

## 3. Add Category

```mermaid
stateDiagram-v2
    state "ADD CATEGORY" as frame {
        state "Admin" as admin_col {
            [*] --> OpenCategoryPage: ●
            OpenCategoryPage --> ClickAdd: Open Category Management page
            ClickAdd --> EnterInfo: Click "Add Category" button
            EnterInfo --> ClickSave: Enter category information
            ClickSave --> [*]: Click "Save" button
            
            state DisplayResult <<choice>>
            DisplayResult --> ShowSuccess: Success
            DisplayResult --> ShowError: Error
            ShowSuccess --> [*]: Display "Category added successfully"
            ShowError --> [*]: Display error message
        }
        
        state "System" as system_col {
            state ValidateInput <<choice>>
            state CheckDuplicate <<choice>>
            
            ClickSave --> ReceiveData: Receive category data
            ReceiveData --> ValidateInput: Validate input data
            
            ValidateInput --> CheckName: Valid
            ValidateInput --> ReturnValidationError: Invalid
            ReturnValidationError --> DisplayResult: Return validation error
            
            CheckName --> CheckDuplicate: Check if category name exists
            
            CheckDuplicate --> InsertCategory: Name is unique
            CheckDuplicate --> ReturnDuplicateError: Name already exists
            ReturnDuplicateError --> DisplayResult: Return duplicate error
            
            InsertCategory --> RefreshList: INSERT category into Database
            RefreshList --> ReturnSuccess: Refresh category list
            ReturnSuccess --> DisplayResult: Return success response
        }
    }
```

---

## 4. Edit Category

```mermaid
stateDiagram-v2
    state "EDIT CATEGORY" as frame {
        state "Admin" as admin_col {
            [*] --> SelectCategory: ●
            SelectCategory --> ClickEdit: Select category to edit
            ClickEdit --> ModifyInfo: Click "Edit" button
            ModifyInfo --> ClickUpdate: Modify category information
            ClickUpdate --> [*]: Click "Update" button
            
            state DisplayResult <<choice>>
            DisplayResult --> ShowSuccess: Success
            DisplayResult --> ShowError: Error
            ShowSuccess --> [*]: Display "Category updated successfully"
            ShowError --> [*]: Display error message
        }
        
        state "System" as system_col {
            state ValidateInput <<choice>>
            state CheckDuplicate <<choice>>
            state CheckExists <<choice>>
            
            ClickUpdate --> ReceiveData: Receive updated category data
            ReceiveData --> ValidateInput: Validate input data
            
            ValidateInput --> CheckExists: Valid
            ValidateInput --> ReturnValidationError: Invalid
            ReturnValidationError --> DisplayResult: Return validation error
            
            CheckExists --> CheckDuplicate: Category exists
            CheckExists --> ReturnNotFound: Category not found
            ReturnNotFound --> DisplayResult: Return not found error
            
            CheckDuplicate --> UpdateCategory: Name is unique or unchanged
            CheckDuplicate --> ReturnDuplicateError: Name already exists
            ReturnDuplicateError --> DisplayResult: Return duplicate error
            
            UpdateCategory --> RefreshList: UPDATE category in Database
            RefreshList --> ReturnSuccess: Refresh category list
            ReturnSuccess --> DisplayResult: Return success response
        }
    }
```

---

## 5. Delete Category

```mermaid
stateDiagram-v2
    state "DELETE CATEGORY" as frame {
        state "Admin" as admin_col {
            [*] --> SelectCategory: ●
            SelectCategory --> ClickDelete: Select category to delete
            ClickDelete --> ConfirmDialog: Click "Delete" button
            
            state ConfirmDialog <<choice>>
            ConfirmDialog --> ClickConfirm: Confirm
            ConfirmDialog --> [*]: Cancel
            
            ClickConfirm --> [*]: Click "Confirm" button
            
            state DisplayResult <<choice>>
            DisplayResult --> ShowSuccess: Success
            DisplayResult --> ShowError: Error/Warning
            ShowSuccess --> [*]: Display "Category deleted successfully"
            ShowError --> [*]: Display error/warning message
        }
        
        state "System" as system_col {
            state CheckExists <<choice>>
            state CheckInUse <<choice>>
            
            ClickConfirm --> CheckExists: Check if category exists
            
            CheckExists --> CheckInUse: Category exists
            CheckExists --> ReturnNotFound: Category not found
            ReturnNotFound --> DisplayResult: Return not found error
            
            CheckInUse --> CheckProducts: Check if category has products
            
            CheckProducts --> DeleteCategory: No products
            CheckProducts --> ReturnInUseError: Has products
            ReturnInUseError --> DisplayResult: Return "Category in use" error
            
            DeleteCategory --> RefreshList: DELETE category from Database
            RefreshList --> ReturnSuccess: Refresh category list
            ReturnSuccess --> DisplayResult: Return success response
        }
    }
```

---

## 6. Export Report by CSV

```mermaid
stateDiagram-v2
    state "EXPORT REPORT BY CSV" as frame {
        state "Admin" as admin_col {
            [*] --> OpenReportPage: ●
            OpenReportPage --> SelectType: Open Reports page
            SelectType --> SelectDateRange: Select report type
            SelectDateRange --> ApplyFilters: Select date range
            ApplyFilters --> ClickExport: Apply filters (optional)
            ClickExport --> [*]: Click "Export Report" button
            
            state DisplayResult <<choice>>
            DisplayResult --> DownloadFile: Success
            DisplayResult --> ShowError: Error
            DownloadFile --> [*]: Download CSV report file
            ShowError --> [*]: Display error message
        }
        
        state "System" as system_col {
            state ValidateParams <<choice>>
            state CheckData <<choice>>
            state GenerateCSV <<choice>>
            
            ClickExport --> ValidateParams: Validate export parameters
            
            ValidateParams --> QueryReport: Valid
            ValidateParams --> ReturnValidationError: Invalid
            ReturnValidationError --> DisplayResult: Return validation error
            
            QueryReport --> CheckData: Query report data from Database
            
            CheckData --> ProcessData: Data exists
            CheckData --> ReturnNoData: No data
            ReturnNoData --> DisplayResult: Return "No data" response
            
            ProcessData --> AggregateData: Process and aggregate data
            AggregateData --> ConvertCSV: Convert to CSV format
            ConvertCSV --> AddHeaders: Add CSV headers
            AddHeaders --> FormatRows: Format data rows
            FormatRows --> AddSummary: Add summary row
            AddSummary --> EncodeUTF8: Encode as UTF-8
            EncodeUTF8 --> GenerateCSV: Generate CSV file
            
            GenerateCSV --> ReturnFile: Success
            GenerateCSV --> ReturnError: Error
            
            ReturnFile --> DisplayResult: Return CSV file
            ReturnError --> DisplayResult: Return error response
        }
    }
```

---

## Notes

### Swimlane Structure
- **Admin Column**: Contains all user actions and interactions
- **System Column**: Contains all backend processing and database operations

### Decision Nodes
- Represented by `<<choice>>` state type in Mermaid
- Branch based on conditions (Valid/Invalid, Success/Error, Yes/No)

### Flow Direction
- Flows from top to bottom
- Crosses between Admin and System swimlanes when interaction occurs
- Returns to Admin column for final display/feedback

### Activity Nodes
- Rounded rectangles represent actions/activities
- Clear, concise descriptions of each step
- Grouped logically within respective swimlanes

### Initial and Final Nodes
- `[*]` represents both initial (●) and final (⊙) nodes
- Each diagram starts with initial node in Admin column
- Each diagram ends with final node in Admin column after displaying result

---

## Diagram Legend

| Symbol | Meaning |
|--------|---------|
| ● | Initial Node (Start) |
| ▭ | Activity Node (Action) |
| ⬟ | Decision Node (Choice) |
| → | Flow Arrow (Direction) |
| ⊙ | Final Node (End) |
| \|\| | Swimlane Separator (Admin \| System) |

---

## Process Summary

### Import Inventory by CSV
1. Admin selects and uploads CSV file
2. System validates file format and headers
3. System processes each row (validate, update/insert)
4. System returns result with success/error count
5. Admin sees success message or error details

### Export Inventory by CSV
1. Admin opens page and applies filters
2. Admin clicks export button
3. System queries and validates data
4. System generates CSV file
5. Admin downloads file or sees error message

### Add Category
1. Admin enters new category information
2. System validates input and checks for duplicates
3. System inserts category into database
4. Admin sees success or error message

### Edit Category
1. Admin modifies existing category information
2. System validates input and checks for duplicates
3. System updates category in database
4. Admin sees success or error message

### Delete Category
1. Admin selects category and confirms deletion
2. System checks if category is in use
3. System deletes category if not in use
4. Admin sees success or warning message

### Export Report by CSV
1. Admin selects report type, date range, and filters
2. System validates parameters and queries data
3. System processes, aggregates, and converts to CSV
4. Admin downloads report file or sees error message
