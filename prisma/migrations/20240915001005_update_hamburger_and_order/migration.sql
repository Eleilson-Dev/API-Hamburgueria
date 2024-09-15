/*
  Warnings:

  - You are about to drop the `_HamburguerToOrder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_HamburguerToOrder" DROP CONSTRAINT "_HamburguerToOrder_A_fkey";

-- DropForeignKey
ALTER TABLE "_HamburguerToOrder" DROP CONSTRAINT "_HamburguerToOrder_B_fkey";

-- DropTable
DROP TABLE "_HamburguerToOrder";
