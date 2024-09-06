-- CreateTable
CREATE TABLE "Supporter" (
    "supporter_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Supporter_pkey" PRIMARY KEY ("supporter_id")
);

-- CreateTable
CREATE TABLE "Support_chat" (
    "sc_id" SERIAL NOT NULL,
    "sc_flag" INTEGER NOT NULL,
    "sc_created_date" TIMESTAMP(3) NOT NULL,
    "sc_updated_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Support_chat_pkey" PRIMARY KEY ("sc_id")
);

-- CreateTable
CREATE TABLE "Support_chat_members" (
    "scm_id" SERIAL NOT NULL,
    "sc_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "supporter_id" INTEGER NOT NULL,
    "supporter_status" TEXT NOT NULL,
    "supporter_status_date" TIMESTAMP(3) NOT NULL,
    "scm_created_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Support_chat_members_pkey" PRIMARY KEY ("scm_id")
);

-- CreateTable
CREATE TABLE "Support_chat_message" (
    "scmsg_id" SERIAL NOT NULL,
    "scm_id" INTEGER NOT NULL,
    "sc_id" INTEGER NOT NULL,
    "msg" TEXT NOT NULL,
    "msg_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Support_chat_message_pkey" PRIMARY KEY ("scmsg_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Supporter_name_key" ON "Supporter"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Supporter_email_key" ON "Supporter"("email");
