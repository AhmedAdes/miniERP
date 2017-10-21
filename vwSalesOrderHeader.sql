
ALTER TABLE dbo.FinishedStoreDetails ADD StoreTypeID INT
ALTER TABLE dbo.SalesOrderDetails ADD StoreTypeID INT
GO

CREATE TABLE StoreTypes
(
	StoreTypeID INT,
	StoreType NVARCHAR(30)
)
GO
INSERT dbo.StoreTypes
        ( StoreTypeID, StoreType )
VALUES  ( 1, N'Pack سرية' ) ,(2, N'Individuel تكسير'), (3, N'Défaut ديفوه'), (4, N'Sample عينات')
GO
UPDATE dbo.FinishedStoreDetails SET StoreTypeID = 1 WHERE StoreTypeID IS NULL
UPDATE dbo.SalesOrderDetails SET StoreTypeID = 1 WHERE StoreTypeID IS NULL
GO

ALTER PROC dbo.FinishDetailInsert
@RecYear INT,@SerialNo INT,@RecordDate DATE,@ColorID INT,@Quantity INT,@BatchNo NVARCHAR(20) ,@FinReceivingID INT,
@FinDispensingID INT,@FinEqualizeID INT,@FinReturnID INT,@FinRejectID INT,@UserID INT, @StoreTypeID INT
AS
INSERT dbo.FinishedStoreDetails
        ( RecYear ,SerialNo ,RecordDate ,ColorID ,Quantity ,BatchNo ,FinReceivingID ,FinDispensingID ,FinEqualizeID ,
          FinReturnID ,FinRejectID ,UserID, StoreTypeID )
VALUES  ( @RecYear ,@SerialNo ,@RecordDate ,@ColorID ,@Quantity ,@BatchNo ,@FinReceivingID ,@FinDispensingID ,@FinEqualizeID ,
          @FinReturnID ,@FinRejectID ,@UserID, @StoreTypeID )
GO

ALTER PROC dbo.FinishDetailUpdate
@FinStoreID INT,@RecYear INT,@SerialNo INT,@RecordDate DATE,@ColorID INT,@Quantity INT,@BatchNo NVARCHAR(20) ,@FinReceivingID INT,
@FinDispensingID INT,@FinEqualizeID INT,@FinReturnID INT,@FinRejectID INT,@UserID INT, @StoreTypeID INT
AS
UPDATE dbo.FinishedStoreDetails SET RecordDate=@RecordDate, ColorID=@ColorID, Quantity=@Quantity, BatchNo=@BatchNo, FinReceivingID=@FinReceivingID,
FinDispensingID=@FinDispensingID ,FinEqualizeID=@FinEqualizeID ,FinReturnID=@FinReturnID ,FinRejectID=@FinRejectID ,UserID=@UserID, StoreTypeID=@StoreTypeID
WHERE FinStoreID=@FinStoreID AND RecYear=@RecYear AND SerialNo=@SerialNo
GO

ALTER PROC dbo.SalesDetailInsert
@SOID INT,@Quantity INT,@Price DECIMAL(10,2),@UserID INT,@ColorID INT, @StoreTypeID INT
AS
INSERT dbo.SalesOrderDetails
        ( SOID ,Quantity ,Price ,UserID ,ColorID, StoreTypeID )
VALUES  ( @SOID ,@Quantity ,@Price ,@UserID ,@ColorID, @StoreTypeID  )
GO

ALTER VIEW	dbo.vwFinishStoreDetails
AS
SELECT d.FinStoreID ,d.RecYear ,d.SerialNo ,d.RecordDate ,d.ColorID ,ABS(d.Quantity) Quantity,d.BatchNo ,
       d.FinReceivingID ,d.FinDispensingID ,d.FinEqualizeID ,d.FinReturnID ,d.FinRejectID ,d.UserID, 
       ModelName, ModelCode, c.ModelID, Color, ColorName, ProdColorCode, d.StoreTypeID, (SELECT StoreType FROM StoreTypes WHERE StoreTypeID=d.StoreTypeID) StoreType
FROM dbo.FinishedStoreDetails d
JOIN dbo.ProductColorCoding c ON c.ColorID = d.ColorID
JOIN dbo.ProductModelCoding m ON m.ModelID = c.ModelID
GO

ALTER VIEW dbo.vwSalesOrderDetail
AS
SELECT  SODetID , SOID , Quantity , Price , sod.UserID , u.UserName , sod.ColorID , c.ColorName , m.ModelID, m.ModelCode, m.ModelName, 
	sod.StoreTypeID, (SELECT StoreType FROM StoreTypes WHERE StoreTypeID=sod.StoreTypeID) StoreType
FROM dbo.SalesOrderDetails sod
JOIN dbo.ProductColorCoding c ON sod.ColorID = c.ColorID
JOIN dbo.ProductModelCoding m ON c.ModelID = m.ModelID
JOIN dbo.SystemUsers u ON sod.UserID = u.UserID
GO

ALTER VIEW dbo.vwSalesOrderHeader
AS
SELECT  SOID , SODate , soh.CustID , c.CustName , SalesTax , Discount , Notes , DeliveryDate ,
        Commisioner , CommisionerTel , soh.UserID , u.UserName, DeliveryType , PayMethod , GrandTotal ,
        soh.SalesRepID , r.SalesPerson, c.ContactPerson, 
		(SELECT SUM(Quantity) FROM dbo.SalesOrderDetails WHERE SOID = soh.SOID) AS SumQty
FROM dbo.SalesOrderHeader soh 
JOIN dbo.Customers c ON soh.CustID = c.CustID
LEFT JOIN dbo.SalesRep r ON soh.SalesRepID = r.SalesRepID
JOIN dbo.SystemUsers u ON soh.UserID = u.UserID
GO

ALTER VIEW dbo.vwFinishStore
AS
SELECT  ModelName, ModelCode, Color, ColorName, ProdColorCode, d.ColorID , SUM(Quantity) Quantity, BatchNo, m.ModelID, d.StoreTypeID, 
(SELECT StoreType FROM StoreTypes WHERE StoreTypeID=d.StoreTypeID) StoreType
FROM dbo.FinishedStoreDetails d
JOIN dbo.ProductColorCoding c ON c.ColorID = d.ColorID
JOIN dbo.ProductModelCoding m ON m.ModelID = c.ModelID
GROUP BY d.ColorID, m.ModelID, ModelName, ModelCode, Color, ColorName, ProdColorCode, d.StoreTypeID, BatchNo
GO