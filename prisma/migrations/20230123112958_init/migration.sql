-- CreateTable
CREATE TABLE "accounts" (
    "accountID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT,
    "password" TEXT,
    "username" TEXT,
    "address" TEXT,
    "phone" TEXT
);

-- CreateTable
CREATE TABLE "availabilities" (
    "accountID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "address" TEXT,
    "sport" TEXT,
    "ability" INTEGER,
    "startDateTime" REAL,
    "endDateTime" REAL,
    CONSTRAINT "availabilities_accountID_fkey" FOREIGN KEY ("accountID") REFERENCES "accounts" ("accountID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "events" (
    "accountID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "location" TEXT,
    "sport" TEXT,
    "ability" INTEGER,
    "dateTime" REAL,
    CONSTRAINT "events_accountID_fkey" FOREIGN KEY ("accountID") REFERENCES "accounts" ("accountID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "notifications" (
    "messageID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "accountID" INTEGER,
    "senderID" INTEGER,
    "message" TEXT,
    "username" TEXT,
    "email" TEXT,
    "phone" TEXT,
    CONSTRAINT "notifications_senderID_fkey" FOREIGN KEY ("senderID") REFERENCES "accounts" ("accountID") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "notifications_accountID_fkey" FOREIGN KEY ("accountID") REFERENCES "accounts" ("accountID") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_accounts_1" ON "accounts"("accountID");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_availabilities_1" ON "availabilities"("accountID");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_events_1" ON "events"("accountID");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_notifications_1" ON "notifications"("messageID");
Pragma writable_schema=0;
