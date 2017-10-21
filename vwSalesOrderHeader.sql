
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

CREATE TABLE Provinces
(
	ProvinceID INT IDENTITY(1,1) NOT NULL,
	Province NVARCHAR(100) NOT NULL,
	engName NVARCHAR(100),
	CONSTRAINT PK_Provinces PRIMARY KEY CLUSTERED (ProvinceID)
)
CREATE TABLE Regions
(
	RegionID INT IDENTITY(1,1) NOT NULL,
	Region NVARCHAR(200) NOT NULL,
	ProvinceID INT,
	CONSTRAINT PK_Regions PRIMARY KEY CLUSTERED (RegionID),
	CONSTRAINT FK_Regions_Provinces FOREIGN KEY (ProvinceID) REFERENCES dbo.Provinces(ProvinceID)
)

INSERT dbo.Provinces (Province,engName) 
VALUES (N'الدقهلية', 'Ad Daqahliyah'),
(N'البحر الأحمر', 'Al Bahr al Ahmar'),
(N'البحيرة',  'Al Buhayrah'),
(N'الفيوم', 'Al Fayyum'),
(N'الغربية', 'Al Gharbiyah'),
(N'الإسكندرية', 'Alexandria'),
(N'الإسماعيلية', 'Al Ismailiyah'),
(N'الجيزة', 'Al Jizah'),
(N'المنيا', 'Al Minya'),
(N'المنوفية', 'Al Minufiyah'),
(N'القليوبية', 'Al Qalyubiyah'),
(N'القاهرة', 'Al Qahirah'),
(N'الأقصر', 'Luxur'),
(N'الوادي الجديد', 'Al Wadi al Jadid'),
(N'السويس', 'Suez'),
(N'السادس من أكتوبر', '6th of October'),
(N'الشرقية', 'Ash Sharqiyah'),
(N'أسوان', 'Aswan'),
(N'أسيوط', 'Asyut'),
(N'بني سويف', 'Bani Suwayf'),
(N'بورسعيد', 'Port Said'),
(N'دمياط', 'Damietta'),
(N'كفر الشيخ', 'Kafr ash Shaykh'),
(N'مطروح', 'Matruh'),
(N'شمال سيناء', 'North Sinai'),
(N'قنا', 'Qina'),
(N'جنوب سيناء', 'South Sinai'),
(N'سوهاج', 'Suhaj'),
(N'حلوان', 'Hulwan')
GO

SET IDENTITY_INSERT [dbo].[Regions] ON 

GO
INSERT [dbo].[Regions] ([RegionID], [Region], [ProvinceID]) VALUES (1, N'النزهة', 12)
,(2, N'مصر الجديدة', 12),(3, N'مدينة نصر - شرق', 12),(4, N'مدينة نصر - غرب', 12),(5, N'المعادي', 12)
,(6, N'الوايلي', 12),(7, N'الزيتون', 12),(8, N'عابدين', 12),(9, N'غرب القاهرة', 12)
,(10, N'البساتين ودار السلام', 12),(11, N'حلوان', 12),(12, N'المطرية', 12),(13, N'عين شمس', 12)
,(14, N'السلام', 12),(15, N'الساحل', 12),(16, N'الزاوية الحمراء', 12),(17, N'حدائق القبة', 12)
,(18, N'المرج', 12),(19, N'الشرابية', 12),(20, N'مصر القديمة', 12),(21, N'الخليفة و المقطم', 12)
,(22, N'روض الفرج', 12),(23, N'منشأة ناصر', 12),(24, N'السيدة زينب', 12),(25, N'وسط القاهرة', 12)
,(26, N'التبين', 12),(27, N'باب الشعرية', 12),(28, N'الموسكي', 12),(29, N'شبرا', 12)
,(30, N'شبرا الخيمة', 12),(31, N'الشرق', 6),(32, N'الوسط', 6),(33, N'الإسماعيلية', 7)
,(34, N'التل الكبير', 7),(35, N'فايد', 7),(36, N'القنطرة شرق', 7),(37, N'القنطرة غرب', 7)
,(38, N'أبو صوير', 7),(39, N'القصاصين', 7),(40, N'الأقصر', 13),(41, N'إسنا', 13)
,(42, N'أرمنت', 13),(43, N'القرنه', 13),(44, N'الزينية', 13),(45, N'الجيزة', 8)
,(46, N'الدقي', 8),(47, N'المهندسين', 8),(48, N'امبابة', 8),(49, N'حي فيصل', 8)
,(50, N'6 أكتوبر', 8),(51, N'حي الهرم', 8),(52, N'البدرشين', 8),(53, N'العياط', 8)
,(54, N'اطفيح', 8),(55, N'الواحات البحرية', 19),(56, N'الداخلة', 14),(57, N'الخارجة', 14)
,(58, N'الفرافرة', 14),(59, N'أبو حماد', 17),(60, N'أبو كبير', 17),(61, N'أولاد صقر', 17)
,(62, N'بلبيس', 17),(63, N'الحسينية', 17),(64, N'ديرب نجم', 17),(65, N'الزقازيق', 17)
,(66, N'الصالحية', 17),(67, N'العاشر من رمضان', 17),(68, N'فاقوس', 17),(69, N'كفر صقر', 17)
,(70, N'منيا القمح', 17),(71, N'ههيا', 17),(72, N'مشتول السوق', 17),(73, N'الإبراهيمية', 17)
,(74, N'القرين', 17),(75, N'القنايات', 17),(76, N'السويس', 15),(77, N'الأربعين', 15)
,(78, N'عتاقة', 15),(79, N'الجناين', 15),(80, N'طابا', 27),(81, N'نويبع', 27)
,(82, N'دهب', 27),(83, N'نخل', 27),(84, N'رأس سدر', 27),(85, N'شرم الشيخ', 27)
,(86, N'بئر العبد', 25),(87, N'نخل', 25),(88, N'الحسنة', 25),(89, N'العريش', 25)
,(90, N'الشيخ زويد', 25),(91, N'رفح', 25),(92, N'أبشواي', 4),(93, N'أطسا', 4)
,(94, N'الفيوم', 4),(95, N'سنورس', 4),(96, N'طامية', 4),(97, N'المنزلة', 1)
,(98, N'الجمالية', 1),(99, N'دكرنس', 1),(100, N'ميت غمر', 1),(101, N'جمصة', 1)
,(102, N'أجا', 1),(103, N'بلقاس', 1),(104, N'السنبلاوين', 1),(105, N'شربين', 1)
,(106, N'طلخا', 1),(107, N'المنصورة', 1),(108, N'منية النصر', 1),(109, N'بنى عبيد', 1)
,(110, N'ميت سلسيل', 1),(111, N'الكردي', 1),(112, N'تمى الأمديد', 1),(113, N'المطرية', 1)
,(114, N'نبروه', 1),(115, N'أبو قرقاص', 9),(116, N'بني مزار', 9),(117, N'دير مواس', 9)
,(118, N'سمالوط', 9),(119, N'العدوة', 9),(120, N'مطاي', 9),(121, N'مغاغة', 9),(122, N'ملوي', 9)
,(123, N'المنيا', 9),(124, N'المنيا الجديدة', 9),(125, N'أسوان', 18),(126, N'إدفو', 18)
,(127, N'كوم امبو', 18),(128, N'دراو', 18),(129, N'نصر النوبة', 18),(130, N'أسيوط', 19)
,(131, N'ديروط', 19),(132, N'قوصية', 19),(133, N'أبنوب', 19),(134, N'منفلوط', 19)
,(135, N'أبو تيج', 19),(136, N'الغنايم', 19),(137, N'ساحل سليم', 19),(138, N'البداري', 19)
,(139, N'صدفا', 19),(140, N'الفتح', 19),(141, N'بنها', 11),(142, N'قليوب', 11)
,(143, N'القناطر الخيرية', 11),(144, N'الخانكة', 11),(145, N'كفر شكر', 11),(146, N'شبين القناطر', 11)
,(147, N'طوخ', 11),(148, N'بني سويف', 20),(149, N'مدينة ناصر', 20),(150, N'الفشن', 20)
,(151, N'ببا', 20),(152, N'أهناسيا', 20),(153, N'الواسطى', 20),(154, N'سمسطا', 20)
,(155, N'حي الشرق', 21),(156, N'حي الجنوب', 21),(157, N'حي بورفؤاد', 21),(158, N'حي الضواحي', 21)
,(159, N'حي المناخ', 21),(160, N'حي الزهور', 21),(161, N'حي العرب', 21),(162, N'دمياط', 22)
,(163, N'كفر سعد', 22),(164, N'فارسكور', 22),(165, N'الزرقا', 22),(166, N'أخميم', 28)
,(167, N'البلينا', 28),(168, N'جرجا', 28),(169, N'دار السلام', 28),(170, N'جهينة', 28)
,(171, N'ساقلتا', 28),(172, N'سوهاج', 28),(173, N'طما', 28),(174, N'طهطا', 28)
,(175, N'المراغة', 28),(176, N'المنشاة', 28),(177, N'أشمون', 10),(178, N'الباجور', 10)
,(179, N'بركة السبع', 10),(180, N'منوف', 10),(181, N'مدينة السادات', 10),(182, N'سرس الليان', 10)
,(183, N'تلا', 10),(184, N'الشهداء', 10),(185, N'شبين الكوم', 10),(186, N'قويسنا', 10)
,(187, N'المحلة الكبرى', 5),(188, N'طنطا', 5),(189, N'سمنود', 5),(190, N'قطور', 5)
,(191, N'السنطة', 5),(192, N'زفتى', 5),(193, N'بسيون', 5),(194, N'كفر الزيات', 5)
,(195, N'أبو تشت', 26),(196, N'فرشوط', 26),(197, N'نجع حمادي', 26),(198, N'الوقف', 26)
,(199, N'دشنا', 26),(200, N'قنا', 26),(201, N'قفط', 26),(202, N'قوص', 26)
,(203, N'نقادة', 26),(204, N'أرمنت', 26),(205, N'إسنا', 26),(206, N'الأقصر', 26)
,(207, N'كفر الشيخ', 23),(208, N'الحامول', 23),(209, N'بيلا', 23),(210, N'قلين', 23)
,(211, N'مطوبس', 23),(212, N'دسوق', 23),(213, N'بلطيم', 23),(214, N'سيدي سالم', 23)
,(215, N'الرياض', 23),(216, N'فوة', 23),(217, N'ركز الحمام', 24),(218, N'مركز العلمين', 24)
,(219, N'مركز الضبعة', 24),(220, N'مركز مطروح', 24),(221, N'مركز النجيلة', 24),(222, N'مركز براني', 24)
,(223, N'مركز السلوم', 24),(224, N'مركز سيوة', 24),(225, N'رشيد', 3),(226, N'شبراخيت', 3)
,(227, N'ايتاي البارود', 3),(228, N'أبو حمص', 3),(229, N'كفر الدوار', 3),(230, N'الدلنجات', 3)
,(231, N'كوم حمادة', 3),(232, N'حوش عيسى', 3),(233, N'دمنهور', 3),(234, N'المحمودية', 3)
,(235, N'إدكو', 3),(236, N'أبو المطامير', 3),(237, N'الرحمانية', 3),(238, N'النوبارية الجديدة', 3)
,(239, N'وادي النطرون', 3),(240, N'الغرب', 6),(241, N'الحوامدية', 8),(242, N'محله ابو على', 5)
,(243, N'محله زياد', 5),(244, N'المحروسة', 26),(245, N'شيبه', 17),(246, N'النخاس', 17)
,(247, N'شنمباره', 17),(248, N'بندق', 17),(249, N'تل حوين', 17),(250, N'شباس', 23),(251, N'العجوزين', 23),(252, N'الغردقة', 2)
,(253, N'سفاجا', 2),(254, N'مرسى علم', 2),(255, N'القصير', 2),(256, N'راس غارب', 2),(257, N'شلاتين', 2)
GO
SET IDENTITY_INSERT [dbo].[Regions] OFF
GO

ALTER TABLE dbo.Customers ADD RegionID INT
ALTER TABLE dbo.Customers ADD CONSTRAINT FK_Customers_Regions FOREIGN KEY (RegionID) REFERENCES dbo.Regions(RegionID)
GO

UPDATE dbo.Customers SET RegionID = qry.RegionID FROM (SELECT RegionID, Region, p.Province FROM dbo.Regions r JOIN dbo.Provinces p ON p.ProvinceID = r.ProvinceID) qry
WHERE qry.Region = Area AND qry.Province = Country

