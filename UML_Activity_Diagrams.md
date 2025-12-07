# UML Activity Diagrams - Inventory & Category Management

This document contains UML Activity Diagrams for Inventory Management and Category Management operations.

---

## 1. Import Inventory by CSV File

### Activity Diagram - Import Inventory CSV

```mermaid
flowchart TD
    Start([Start]) --> SelectFile[Admin: Select CSV file from computer]
    SelectFile --> ClickImport[Admin: Click Import CSV button]
    ClickImport --> ValidateFormat{System: Validate file format}
    
    ValidateFormat -->|Invalid| ShowFormatError[System: Display error - Invalid file format]
    ShowFormatError --> End1([End])
    
    ValidateFormat -->|Valid| SendToBackend[Frontend: Send CSV file to Backend API]
    SendToBackend --> ReadFile[Backend: Read CSV file]
    ReadFile --> CheckHeaders{Backend: Check CSV headers}
    
    CheckHeaders -->|Missing headers| ReturnHeaderError[Backend: Return error - Missing required headers]
    ReturnHeaderError --> DisplayHeaderError[Frontend: Display error message]
    DisplayHeaderError --> End2([End])
    
    CheckHeaders -->|Valid headers| ValidateRows[Backend: Validate each row]
    ValidateRows --> ProcessRows{Backend: Process each row}
    
    ProcessRows --> CheckSKU{Backend: Check if SKU exists in Database}
    CheckSKU -->|Exists| UpdateRecord[Backend: UPDATE inventory record]
    CheckSKU -->|Not exists| InsertRecord[Backend: INSERT new inventory record]
    
    UpdateRecord --> RecordSuccess[Backend: Increment success_count]
    InsertRecord --> RecordSuccess
    
    ProcessRows -->|Invalid data| SkipRow[Backend: Skip row and log error]
    SkipRow --> RecordError[Backend: Increment error_count]
    
    RecordSuccess --> MoreRows{Backend: More rows to process?}
    RecordError --> MoreRows
    
    MoreRows -->|Yes| ProcessRows
    MoreRows -->|No| ReturnResult[Backend: Return result with success_count and error_count]
    
    ReturnResult --> RefreshList[Frontend: Refresh inventory list]
    RefreshList --> CheckErrors{Frontend: Check if error_count > 0}
    
    CheckErrors -->|Yes| ShowWarning[Frontend: Display warning with error list]
    CheckErrors -->|No| ShowSuccess[Frontend: Display success message]
    
    ShowWarning --> End3([End])
    ShowSuccess --> End4([End])
```

---

## 2. Export Inventory by CSV File

### Activity Diagram - Export Inventory CSV

```mermaid
flowchart TD
    Start([Start]) --> OpenPage[Admin: Open Inventory Management page]
    OpenPage --> ApplyFilters{Admin: Apply filters?}
    
    ApplyFilters -->|Yes| SelectFilters[Admin: Select filters - category, supplier, status]
    ApplyFilters -->|No| ClickExport[Admin: Click Export CSV button]
    
    SelectFilters --> ClickExport
    ClickExport --> SendRequest[Frontend: Send export request to Backend]
    
    SendRequest --> QueryData[Backend: Query inventory data from Database]
    QueryData --> CheckData{Backend: Check if data exists}
    
    CheckData -->|No data| ReturnNoData[Backend: Return error - No data available]
    ReturnNoData --> DisplayNoData[Frontend: Display info message - No data to export]
    DisplayNoData --> End1([End])
    
    CheckData -->|Data exists| ConvertCSV[Backend: Convert data to CSV format]
    ConvertCSV --> AddHeaders[Backend: Add CSV headers]
    AddHeaders --> FormatRows[Backend: Format data rows]
    FormatRows --> EncodeUTF8[Backend: Encode as UTF-8]
    
    EncodeUTF8 --> CheckGeneration{Backend: CSV generation successful?}
    
    CheckGeneration -->|Failed| ReturnError[Backend: Return error - Export failed]
    ReturnError --> DisplayError[Frontend: Display error message]
    DisplayError --> End2([End])
    
    CheckGeneration -->|Success| ReturnCSV[Backend: Return CSV file]
    ReturnCSV --> TriggerDownload[Frontend: Trigger file download]
    TriggerDownload --> DownloadFile[Browser: Download inventory_export_YYYY-MM-DD.csv]
    DownloadFile --> ShowSuccess[Frontend: Display success message]
    ShowSuccess --> End3([End])
```

---

## 3. Add Category

### Activity Diagram - Add Category

```mermaid
flowchart TD
    Start([Start]) --> OpenPage[Admin: Open Category Management page]
    OpenPage --> ClickAdd[Admin: Click Add Category button]
    ClickAdd --> ShowForm[System: Display Add Category form]
    
    ShowForm --> EnterData[Admin: Enter category information - name, description, status]
    EnterData --> ClickSave[Admin: Click Save button]
    
    ClickSave --> ValidateInput{Frontend: Validate input data}
    
    ValidateInput -->|Invalid| ShowValidationError[Frontend: Display validation error - Missing required fields]
    ShowValidationError --> EnterData
    
    ValidateInput -->|Valid| SendToBackend[Frontend: Send POST request to Backend API]
    SendToBackend --> ValidateBackend[Backend: Validate data]
    ValidateBackend --> CheckDuplicate{Backend: Check if category name exists}
    
    CheckDuplicate -->|Exists| ReturnDuplicate[Backend: Return error - Category name already exists]
    ReturnDuplicate --> DisplayDuplicate[Frontend: Display error message]
    DisplayDuplicate --> End1([End])
    
    CheckDuplicate -->|Not exists| InsertCategory[Backend: INSERT new category into Database]
    InsertCategory --> CheckInsert{Database: Insert successful?}
    
    CheckInsert -->|Failed| ReturnDBError[Backend: Return error - Database error]
    ReturnDBError --> DisplayDBError[Frontend: Display error message]
    DisplayDBError --> End2([End])
    
    CheckInsert -->|Success| ReturnSuccess[Backend: Return success with new category data]
    ReturnSuccess --> RefreshList[Frontend: Refresh category list]
    RefreshList --> CloseForm[Frontend: Close Add Category form]
    CloseForm --> ShowSuccess[Frontend: Display success message - Category added successfully]
    ShowSuccess --> End3([End])
```

---

## 4. Edit Category

### Activity Diagram - Edit Category

```mermaid
flowchart TD
    Start([Start]) --> OpenPage[Admin: Open Category Management page]
    OpenPage --> SelectCategory[Admin: Select category to edit]
    SelectCategory --> ClickEdit[Admin: Click Edit button]
    
    ClickEdit --> ShowForm[System: Display Edit Category form with current data]
    ShowForm --> ModifyData[Admin: Modify category information]
    ModifyData --> ClickUpdate[Admin: Click Update button]
    
    ClickUpdate --> ValidateInput{Frontend: Validate input data}
    
    ValidateInput -->|Invalid| ShowValidationError[Frontend: Display validation error]
    ShowValidationError --> ModifyData
    
    ValidateInput -->|Valid| SendToBackend[Frontend: Send PUT request to Backend API]
    SendToBackend --> ValidateBackend[Backend: Validate data]
    ValidateBackend --> CheckExists{Backend: Check if category exists}
    
    CheckExists -->|Not found| ReturnNotFound[Backend: Return error - Category not found]
    ReturnNotFound --> DisplayNotFound[Frontend: Display error - Category may have been deleted]
    DisplayNotFound --> RefreshList1[Frontend: Refresh category list]
    RefreshList1 --> End1([End])
    
    CheckExists -->|Exists| CheckDuplicate{Backend: Check if new name already exists - excluding current category}
    
    CheckDuplicate -->|Duplicate| ReturnDuplicate[Backend: Return error - Category name already exists]
    ReturnDuplicate --> DisplayDuplicate[Frontend: Display error message]
    DisplayDuplicate --> End2([End])
    
    CheckDuplicate -->|Unique| UpdateCategory[Backend: UPDATE category in Database]
    UpdateCategory --> CheckUpdate{Database: Update successful?}
    
    CheckUpdate -->|Failed| ReturnDBError[Backend: Return error - Database error]
    ReturnDBError --> DisplayDBError[Frontend: Display error message]
    DisplayDBError --> End3([End])
    
    CheckUpdate -->|Success| ReturnSuccess[Backend: Return success with updated category data]
    ReturnSuccess --> RefreshList2[Frontend: Refresh category list]
    RefreshList2 --> CloseForm[Frontend: Close Edit Category form]
    CloseForm --> ShowSuccess[Frontend: Display success message - Category updated successfully]
    ShowSuccess --> End4([End])
```

---

## 5. Delete Category

### Activity Diagram - Delete Category

```mermaid
flowchart TD
    Start([Start]) --> OpenPage[Admin: Open Category Management page]
    OpenPage --> SelectCategory[Admin: Select category to delete]
    SelectCategory --> ClickDelete[Admin: Click Delete button]
    
    ClickDelete --> ShowConfirm[System: Display confirmation dialog - Are you sure?]
    ShowConfirm --> UserChoice{Admin: Confirm or Cancel?}
    
    UserChoice -->|Cancel| CloseDialog[Frontend: Close confirmation dialog]
    CloseDialog --> End1([End])
    
    UserChoice -->|Confirm| SendToBackend[Frontend: Send DELETE request to Backend API]
    SendToBackend --> CheckExists{Backend: Check if category exists}
    
    CheckExists -->|Not found| ReturnNotFound[Backend: Return error - Category not found]
    ReturnNotFound --> DisplayNotFound[Frontend: Display info - Category may have been already deleted]
    DisplayNotFound --> RefreshList1[Frontend: Refresh category list]
    RefreshList1 --> End2([End])
    
    CheckExists -->|Exists| CheckUsage{Backend: Check if category has associated products}
    
    CheckUsage -->|Has products| ReturnInUse[Backend: Return error - Category in use with X products]
    ReturnInUse --> DisplayInUse[Frontend: Display error - Cannot delete category. It has X associated products]
    DisplayInUse --> End3([End])
    
    CheckUsage -->|No products| DeleteCategory[Backend: DELETE category from Database]
    DeleteCategory --> CheckDelete{Database: Delete successful?}
    
    CheckDelete -->|Failed| ReturnDBError[Backend: Return error - Database error]
    ReturnDBError --> DisplayDBError[Frontend: Display error message]
    DisplayDBError --> End4([End])
    
    CheckDelete -->|Success| ReturnSuccess[Backend: Return success message]
    ReturnSuccess --> RefreshList2[Frontend: Refresh category list]
    RefreshList2 --> ShowSuccess[Frontend: Display success message - Category deleted successfully]
    ShowSuccess --> End5([End])
```

---

## 6. Export Report by CSV

### Activity Diagram - Export Report CSV

```mermaid
flowchart TD
    Start([Start]) --> OpenPage[Admin: Open Reports page]
    OpenPage --> SelectType[Admin: Select report type - Sales, Inventory, Orders, Revenue]
    SelectType --> SelectDateRange[Admin: Select date range - start_date, end_date]
    SelectDateRange --> ApplyFilters{Admin: Apply filters?}
    
    ApplyFilters -->|Yes| SelectFilters[Admin: Select filters - category, status, customer, etc.]
    ApplyFilters -->|No| ClickExport[Admin: Click Export Report button]
    
    SelectFilters --> ClickExport
    ClickExport --> ValidateParams{Frontend: Validate parameters}
    
    ValidateParams -->|Invalid| ShowValidationError[Frontend: Display error - Please select report type and date range]
    ShowValidationError --> End1([End])
    
    ValidateParams -->|Valid| CheckDateRange{Frontend: Validate date range}
    
    CheckDateRange -->|Invalid| ShowDateError[Frontend: Display error - End date must be after start date]
    ShowDateError --> End2([End])
    
    CheckDateRange -->|Valid| SendRequest[Frontend: Send POST request to Backend API]
    SendRequest --> QueryData[Backend: Query report data from Database based on type and filters]
    
    QueryData --> CheckDBConnection{Backend: Database connection successful?}
    
    CheckDBConnection -->|Failed| ReturnDBError[Backend: Return error - Database error]
    ReturnDBError --> DisplayDBError[Frontend: Display error - Export failed. Please try again]
    DisplayDBError --> End3([End])
    
    CheckDBConnection -->|Success| CheckData{Backend: Check if data exists}
    
    CheckData -->|No data| ReturnNoData[Backend: Return error - No data available for selected criteria]
    ReturnNoData --> DisplayNoData[Frontend: Display info - No data available. Please try different criteria]
    DisplayNoData --> End4([End])
    
    CheckData -->|Data exists| ProcessData[Backend: Process and aggregate data]
    ProcessData --> ConvertCSV[Backend: Convert data to CSV format]
    ConvertCSV --> AddHeaders[Backend: Add CSV headers based on report type]
    AddHeaders --> FormatRows[Backend: Format data rows]
    FormatRows --> AddSummary[Backend: Add summary/totals row]
    AddSummary --> EncodeUTF8[Backend: Encode as UTF-8]
    
    EncodeUTF8 --> CheckGeneration{Backend: CSV generation successful?}
    
    CheckGeneration -->|Failed| ReturnGenError[Backend: Return error - Export failed]
    ReturnGenError --> DisplayGenError[Frontend: Display error - Failed to generate report]
    DisplayGenError --> End5([End])
    
    CheckGeneration -->|Success| ReturnCSV[Backend: Return CSV file]
    ReturnCSV --> TriggerDownload[Frontend: Trigger file download]
    TriggerDownload --> DownloadFile[Browser: Download report_type_YYYY-MM-DD_to_YYYY-MM-DD.csv]
    DownloadFile --> ShowSuccess[Frontend: Display success message - Report exported successfully]
    ShowSuccess --> End6([End])
```

---

## Diagram Conventions

### Symbols Used

- **Rounded Rectangle (Start/End)**: Start and End points
- **Rectangle**: Process/Action steps
- **Diamond**: Decision points
- **Arrow**: Flow direction

### Actor Notation

- **Admin**: Actions performed by the administrator
- **Frontend**: Frontend application processes
- **Backend**: Backend API processes
- **System**: General system processes
- **Database**: Database operations
- **Browser**: Browser actions

### Color Coding (Conceptual)

- **Admin actions**: User interactions
- **Frontend processes**: Client-side validation and UI updates
- **Backend processes**: Server-side logic and validation
- **Database operations**: Data persistence operations
- **Success paths**: Green flow
- **Error paths**: Red flow
- **Decision points**: Yellow/Orange

---

## Notes

1. All activity diagrams follow the swimlane concept with clear separation between Admin and System responsibilities
2. Each diagram includes comprehensive error handling paths
3. Validation occurs at multiple levels (Frontend and Backend)
4. Database operations include success/failure checks
5. User feedback is provided at each critical step
6. All diagrams support the complete user journey from start to end

---

## Flow Summary

| Feature | Main Steps | Decision Points | End States |
|---------|-----------|-----------------|------------|
| **Import Inventory CSV** | Select file → Validate → Process rows → Update DB | File format, Headers, Row data validity | Success, Partial success with errors, Error |
| **Export Inventory CSV** | Apply filters → Request export → Query data → Generate CSV | Data exists, Generation success | Success, No data, Error |
| **Add Category** | Enter data → Validate → Check duplicate → Insert | Input validity, Name uniqueness | Success, Validation error, Duplicate error, DB error |
| **Edit Category** | Modify data → Validate → Check exists → Update | Input validity, Category exists, Name uniqueness | Success, Not found, Duplicate error, DB error |
| **Delete Category** | Confirm → Check exists → Check usage → Delete | User confirmation, Category exists, Has products | Success, Cancelled, Not found, In use, DB error |
| **Export Report CSV** | Select type → Set date range → Apply filters → Query → Generate CSV | Parameters valid, Date range valid, Data exists, Generation success | Success, Validation error, No data, DB error, Generation error |
