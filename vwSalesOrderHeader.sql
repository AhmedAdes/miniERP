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

Alter VIEW vwFinProductActivity
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