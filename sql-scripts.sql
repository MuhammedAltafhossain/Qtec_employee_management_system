USE [qtec_test]
GO
/****** Object:  Table [dbo].[__EFMigrationsHistory]    Script Date: 1/8/2025 10:52:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[__EFMigrationsHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Departments]    Script Date: 1/8/2025 10:52:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Departments](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[DepartmentName] [nvarchar](450) NOT NULL,
	[ManagerId] [int] NULL,
	[Budget] [decimal](18, 2) NOT NULL,
 CONSTRAINT [PK_Departments] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Employees]    Script Date: 1/8/2025 10:52:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Employees](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](450) NOT NULL,
	[Email] [nvarchar](max) NOT NULL,
	[Phone] [nvarchar](max) NOT NULL,
	[Position] [nvarchar](450) NOT NULL,
	[JoiningDate] [datetime2](7) NOT NULL,
	[DepartmentId] [int] NOT NULL,
	[Status] [int] NOT NULL,
 CONSTRAINT [PK_Employees] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PerformanceReviews]    Script Date: 1/8/2025 10:52:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PerformanceReviews](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[EmployeeId] [int] NOT NULL,
	[ReviewDate] [datetime2](7) NOT NULL,
	[ReviewScore] [int] NOT NULL,
	[ReviewNotes] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_PerformanceReviews] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[Employees] ADD  DEFAULT ((0)) FOR [Status]
GO
ALTER TABLE [dbo].[Departments]  WITH CHECK ADD  CONSTRAINT [FK_Departments_Employees_ManagerId] FOREIGN KEY([ManagerId])
REFERENCES [dbo].[Employees] ([Id])
GO
ALTER TABLE [dbo].[Departments] CHECK CONSTRAINT [FK_Departments_Employees_ManagerId]
GO
ALTER TABLE [dbo].[Employees]  WITH CHECK ADD  CONSTRAINT [FK_Employees_Departments_DepartmentId] FOREIGN KEY([DepartmentId])
REFERENCES [dbo].[Departments] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Employees] CHECK CONSTRAINT [FK_Employees_Departments_DepartmentId]
GO
ALTER TABLE [dbo].[PerformanceReviews]  WITH CHECK ADD  CONSTRAINT [FK_PerformanceReviews_Employees_EmployeeId] FOREIGN KEY([EmployeeId])
REFERENCES [dbo].[Employees] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[PerformanceReviews] CHECK CONSTRAINT [FK_PerformanceReviews_Employees_EmployeeId]
GO
/****** Object:  StoredProcedure [dbo].[AddEmployee]    Script Date: 1/8/2025 10:52:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[AddEmployee]
    @Name NVARCHAR(100),
    @Phone NVARCHAR(12),
    @JoiningDate DATETIME2(7),
    @Email NVARCHAR(100),
    @Position NVARCHAR(100),
    @DepartmentId INT
AS
BEGIN
    BEGIN TRANSACTION;

    BEGIN TRY
        INSERT INTO Employees (Name, Email, Phone, JoiningDate, Position, DepartmentId, Status)
        VALUES (@Name, @Email, @Phone, @JoiningDate, @Position, @DepartmentId, 1);

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH;
END;
GO
/****** Object:  StoredProcedure [dbo].[AveragePerformanceScoreByDepartment]    Script Date: 1/8/2025 10:52:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[AveragePerformanceScoreByDepartment]
    @departmentId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        D.DepartmentName, 
        CAST(AVG(PR.ReviewScore) AS FLOAT) AS AveragePerformanceScore
    FROM 
        Departments D
    INNER JOIN 
        Employees E ON D.Id = E.DepartmentId
    INNER JOIN 
        PerformanceReviews PR ON E.Id = PR.EmployeeId
    WHERE 
        PR.ReviewScore IS NOT NULL
        AND D.Id = @departmentId  
    GROUP BY 
        D.DepartmentName
    OPTION (RECOMPILE);
END;
GO
/****** Object:  StoredProcedure [dbo].[UpdateEmployee]    Script Date: 1/8/2025 10:52:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[UpdateEmployee]
    @Id INT,
    @Name NVARCHAR(100),
    @Phone NVARCHAR(12),
    @JoiningDate DATETIME2(7),
    @Email NVARCHAR(100),
    @Position NVARCHAR(100),
    @DepartmentId INT
AS
BEGIN
    BEGIN TRANSACTION;

    BEGIN TRY
        -- Update the employee record
        UPDATE Employees
        SET 
            Name = @Name,
            Phone = @Phone,
            JoiningDate = @JoiningDate,
            Email = @Email,
            Position = @Position,
            DepartmentId = @DepartmentId
        WHERE Id = @Id;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH;
END;
GO
