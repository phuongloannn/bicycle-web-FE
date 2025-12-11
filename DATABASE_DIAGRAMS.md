
# Database Diagrams

Dưới đây là mô hình cơ sở dữ liệu cho dự án `sms_demo-3.sql`, bao gồm:
1. **Mô hình ER (Entity-Relationship - Mức khái niệm)**: Tập trung vào các thực thể và mối quan hệ nghiệp vụ.
2. **Mô hình ERD (Entity-Relationship Diagram - Mức vật lý)**: Chi tiết cấu trúc bảng, kiểu dữ liệu và khóa ngoại.

---

## 1. Mô hình ER (Conceptual Model)

Mô hình này mô tả các thực thể chính và mối quan hệ giữa chúng bằng ký pháp Chen (giả lập) để dễ hình dung logic nghiệp vụ.

```mermaid
flowchart TD
    %% Styling
    classDef entity fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef relation fill:#fce4ec,stroke:#880e4f,stroke-width:2px,shape:rhombus;
    classDef attribute fill:#fff,stroke:#333,stroke-dasharray: 5 5;

    %% Entities
    User[User]:::entity
    Customer[Customer]:::entity
    Product[Product]:::entity
    Order[Order]:::entity
    Category[Category]:::entity
    Cart[Cart]:::entity
    Inventory[Inventory]:::entity
    Payment[Payment]:::entity
    Accessory[Accessory]:::entity
    Spec[Specification]:::entity

    %% Relationships
    Place{Places}:::relation
    Contain{Contains}:::relation
    Belong{Belongs To}:::relation
    Has{Has}:::relation
    Pay{Paid By}:::relation
    Categorize{Categorizes}:::relation
    Stock{Stocked In}:::relation
    SpecRel{Has Specs}:::relation

    %% Connections
    Customer --- Place --- Order
    Order --- Contain --- Product
    User --- Has --- Cart
    Cart --- Contain --- Product
    Product --- Belong --- Category
    Accessory --- Belong --- Category
    Product --- Stock --- Inventory
    Product --- SpecRel --- Spec
    Order --- Pay --- Payment

    %% Sub-relationships for Payments
    Payment -.-> BankTransfer[Bank Transfer]
    Payment -.-> COD[COD]
    Payment -.-> CreditCard[Credit Card]
```

---

## 2. Mô hình ERD (Physical Model)

Mô hình này phản ánh chính xác 100% cấu trúc file `sms_demo-3.sql`, bao gồm tên cột (case-sensitive), kiểu dữ liệu và các mối quan hệ khóa ngoại (Foreign Keys).

```mermaid
erDiagram
    users {
        int id PK
        string password
        enum role "Admin, User"
        string email
        string name
        datetime createdAt
        datetime updatedAt
    }

    customers {
        int id PK
        string name
        string email
        tinyint is_guest
        string temporary_token
        datetime guest_expires_at
        string phone
        string address
        datetime created_at
        datetime updated_at
    }

    categories {
        int id PK
        string name
        string slug
        int parent_id
        string thumbnail
        tinyint is_active
        datetime created_at
        datetime updated_at
    }

    products {
        int id PK
        string name
        text description
        string sku
        string brand
        year model_year
        longtext color_options
        decimal price
        int stock
        string category
        string bike_type
        longtext attributes
        string image_url
        datetime createdAt
        datetime updatedAt
        int quantity
        int category_id FK
    }

    bike_accessories {
        int id PK
        string name
        text description
        decimal price
        string category
        longtext compatible_with
        tinyint in_stock
        string image_url
        string image_filename
        timestamp created_at
        timestamp updated_at
        int category_id FK
    }

    carts {
        int id PK
        int userId FK
        string sessionId
        int productId FK
        int quantity
        decimal price
        timestamp createdAt
        timestamp updatedAt
    }

    orders {
        int id PK
        int customer_id "Legacy/Internal ID"
        string guest_session_id
        tinyint is_guest_order
        datetime order_date
        enum status "Pending, Paid, Shipped, Canceled"
        decimal totalAmount
        int created_by FK
        datetime created_at
        int customerId FK "Main Customer Link"
        string orderNumber
        text shipping_address
        text billing_address
        string payment_method
        tinyint is_paid
        timestamp paid_at
        string phone
        string email
        text customer_notes
        text cancellation_reason
        timestamp completed_at
        timestamp cancelled_at
        timestamp updated_at
    }

    order_items {
        int id PK
        int orderId FK
        int productId FK
        int quantity
        decimal unitPrice
        decimal totalPrice
        datetime createdAt
        datetime updatedAt
        enum type "product, accessory"
    }

    payments {
        int id PK
        int order_id FK
        enum payment_method
        decimal amount
        enum status
        string transaction_code
        string payment_proof_url
        timestamp created_at
        timestamp updated_at
    }

    bank_transfers {
        int id PK
        int payment_id FK
        string bank_name
        string account_number
        string account_name
        timestamp transfer_date
        decimal transfer_amount
        string transfer_proof_url
        timestamp created_at
        timestamp updated_at
    }

    bank_transfer_payments {
        int id PK
        int payment_id FK
        string bank_name
        string account_number
        string transfer_proof_url
        timestamp created_at
        timestamp updated_at
    }

    cod_payments {
        int id PK
        int payment_id FK
        int shipper_id
        decimal received_amount
        timestamp received_date
    }

    credit_card_payments {
        int id PK
        int payment_id FK
        string card_holder_name
        string card_number_last4
        string card_type
        timestamp transaction_date
        string authorization_code
    }

    inventory {
        int id PK
        int product_id FK
        int category_id FK
        int quantity
        int reserved
        int min_stock
        string location
        datetime created_at
        datetime updated_at
    }

    product_specifications {
        int id PK
        int product_id FK
        string frame_size
        string wheel_size
        string gear_system
        string brake_type
        decimal weight
        string material
        timestamp created_at
        timestamp updated_at
    }

    test_ride_schedules {
        int id PK
        int product_id FK
        string customer_name
        string customer_phone
        string customer_email
        datetime scheduled_date
        enum status
        text notes
        timestamp created_at
        timestamp updated_at
    }

    %% --- RELATIONSHIPS (FK Constraints) ---

    %% Users & Carts
    users ||--o{ carts : "owns"
    products ||--o{ carts : "added_to"

    %% Orders Relationships
    customers ||--o{ orders : "places (customerId)"
    users ||--o{ orders : "creates (created_by)"
    
    %% Order Items
    orders ||--o{ order_items : "contains"
    products ||--o{ order_items : "is_item"

    %% Payments
    orders ||--o{ payments : "has_payment"
    payments ||--o{ bank_transfers : "details"
    payments ||--o{ bank_transfer_payments : "details"
    payments ||--o{ cod_payments : "details"
    payments ||--o{ credit_card_payments : "details"

    %% Categories & Products hierarchy
    categories ||--o{ products : "categorizes"
    categories ||--o{ bike_accessories : "categorizes"
    categories ||--o{ inventory : "categorizes"
    categories ||--o{ product_categories : "relates"

    %% Product Details
    products ||--o{ product_specifications : "has_specs"
    products ||--o{ inventory : "has_stock"
    products ||--o{ test_ride_schedules : "scheduled_for"
    products ||--o{ product_categories : "in_category"
```
