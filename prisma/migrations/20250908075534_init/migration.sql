-- CreateTable
CREATE TABLE "public"."LabUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',

    CONSTRAINT "LabUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LabRequest" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT DEFAULT 'pending',
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "LabRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LabUser_email_key" ON "public"."LabUser"("email");

-- AddForeignKey
ALTER TABLE "public"."LabRequest" ADD CONSTRAINT "LabRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."LabUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
