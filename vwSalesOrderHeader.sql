SET QUOTED_IDENTIFIER ON
SET ANSI_NULLS ON
GO

ALTER VIEW vwSalesOrderHeader
AS
SELECT  SOID , SODate , soh.CustID , c.CustName , SalesTax , Discount , Notes , DeliveryDate ,
        Commisioner , CommisionerTel , soh.UserID , u.UserName, DeliveryType , PayMethod , GrandTotal ,
        soh.SalesRepID , r.SalesPerson, c.ContactPerson
FROM dbo.SalesOrderHeader soh 
JOIN dbo.Customers c ON soh.CustID = c.CustID
LEFT JOIN dbo.SalesRep r ON soh.SalesRepID = r.SalesRepID
JOIN dbo.SystemUsers u ON soh.UserID = u.UserID
GO

ALTER VIEW vwFinishStore
AS
SELECT  ModelName, ModelCode, Color, ColorName, ProdColorCode, d.ColorID , SUM(Quantity) Quantity, BatchNo, m.ModelID
FROM dbo.FinishedStoreDetails d
JOIN dbo.ProductColorCoding c ON c.ColorID = d.ColorID
JOIN dbo.ProductModelCoding m ON m.ModelID = c.ModelID
GROUP BY d.ColorID, m.ModelID, ModelName, ModelCode, Color, ColorName, ProdColorCode, BatchNo
GO

Create VIEW vwFinProductActivity
AS 
SELECT FinStoreID ,det.RecYear ,det.SerialNo ,RecordDate ,det.ColorID ,Quantity ,det.BatchNo ,
       det.FinReceivingID ,det.FinDispensingID ,det.FinEqualizeID ,det.FinReturnID ,det.FinRejectID ,
       ModelName ,ModelCode ,m.ModelID ,Color ,ColorName ,ProdColorCode, 
	   fr.ReceivingDate, fr.ReceivedFrom, 
	   fd.DispensingDate, fd.SOID, fd.DispenseTo, 
	   fe.EqualizeDate, fe.EqualizeType, fn.ReturnDate, fn.ReturnFrom
FROM dbo.FinishedStoreDetails det
JOIN dbo.ProductColorCoding c ON c.ColorID = det.ColorID
JOIN dbo.ProductModelCoding m ON m.ModelID = c.ModelID
LEFT JOIN dbo.FinishedReceiving fr ON fr.FinReceivingID = det.FinReceivingID
LEFT JOIN dbo.FinishedDispensing fd ON fd.FinDispensingID = det.FinDispensingID
LEFT JOIN dbo.FinStoreEqualization fe ON fe.FinEqualizeID = det.FinEqualizeID
LEFT JOIN dbo.FinishedReturn fn ON fn.FinReturnID = det.FinReturnID
GO

ALTER TABLE dbo.FinishedReturn ADD SOID INT
ALTER TABLE dbo.FinishedReturn ADD CONSTRAINT FK_FinishedReturn_SOID FOREIGN KEY (SOID) REFERENCES dbo.SalesOrderHeader(SOID)
GO

ALTER PROC [dbo].[FinishReturnInsert]
@RecYear INT,@SerialNo INT,@ReturnDate DATE ,@ReturnFrom NVARCHAR(200), @ReturnReason NVARCHAR(max), @SOID INT, @UserID INT
AS
INSERT dbo.FinishedReturn
        ( RecYear ,SerialNo ,ReturnDate ,ReturnFrom ,ReturnReason ,SOID ,UserID )
VALUES  ( @RecYear , (SELECT ISNULL(MAX(SerialNo), 0) +1 FROM dbo.FinishedReturn WHERE RecYear=@RecYear) ,@ReturnDate ,@ReturnFrom, @ReturnReason, @SOID, @UserID)
SELECT @@IDENTITY AS FinReturnID, SerialNo FROM dbo.FinishedReturn WHERE FinReturnID = @@IDENTITY
GO

ALTER PROC [dbo].[FinishReturnUpdate]
@FinReturnID INT, @RecYear INT,@SerialNo INT,@ReturnDate DATE ,@ReturnFrom NVARCHAR(200), @ReturnReason NVARCHAR(max), @SOID INT, @UserID INT
AS
UPDATE dbo.FinishedReturn SET RecYear=@RecYear ,SerialNo=@SerialNo ,ReturnDate=@ReturnDate ,ReturnFrom=@ReturnFrom, ReturnReason=@ReturnReason, SOID=@SOID ,UserID=@UserID 
WHERE FinReturnID = @FinReturnID
GO
