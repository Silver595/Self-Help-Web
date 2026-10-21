erDiagram
    User ||--o{ Resource : owns
    User ||--o{ Habit : tracks
    User ||--o{ Note : writes
    User ||--o{ Journal : logs
    
    Resource ||--o{ Note : "has optional"
    Habit ||--o{ Note : "has optional"

    User {
        ObjectId _id PK
        string email
        string password
    }

    Resource {
        ObjectId _id PK
        ObjectId user FK
        string title
        string type "Book, Article, YouTube"
        string status "To Read, Reading, Completed"
    }

    Habit {
        ObjectId _id PK
        ObjectId user FK
        string title
        array completedDates "YYYY-MM-DD"
        number streak
    }

    Note {
        ObjectId _id PK
        ObjectId user FK
        ObjectId resource FK "Optional"
        ObjectId habit FK "Optional"
        string content
    }

    Journal {
        ObjectId _id PK
        ObjectId user FK
        string title
        string content
        string mood
    }