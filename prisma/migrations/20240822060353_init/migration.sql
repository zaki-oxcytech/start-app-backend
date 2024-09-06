-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "resetotp" TEXT,
    "verified" TEXT,
    "verifyotp" TEXT,
    "company_existing" TEXT,
    "address" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Detail" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "teamLeader" TEXT NOT NULL,
    "teamMember" TEXT[],
    "cost" INTEGER NOT NULL,
    "size" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "projectType" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CompanyToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_CompanyToUser_AB_unique" ON "_CompanyToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_CompanyToUser_B_index" ON "_CompanyToUser"("B");

-- AddForeignKey
ALTER TABLE "_CompanyToUser" ADD CONSTRAINT "_CompanyToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyToUser" ADD CONSTRAINT "_CompanyToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
