-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_hamburguerId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_hamburguerId_fkey" FOREIGN KEY ("hamburguerId") REFERENCES "Hamburguer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
