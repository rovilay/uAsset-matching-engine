-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "uassetSymbol" TEXT NOT NULL,
    "side" TEXT NOT NULL,
    "initialQuatity" REAL NOT NULL,
    "quantity" REAL NOT NULL,
    "price" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
