using AndalusiaAcademy.API.Data;
using AndalusiaAcademy.API.Models.Catalog;
using Microsoft.EntityFrameworkCore;

namespace AndalusiaAcademy.API.Data.Seed;

public static class CatalogDbSeeder
{
    public static async Task SeedCatalogAsync(ApplicationDbContext context)
    {
        // if (await context.Courses.AnyAsync() && await context.Programs.AnyAsync())
        // {
        //     return; 
        // }

        var categories = new Dictionary<string, Category>
        {
            ["Software Engineering"] = new() { Name = "Software Engineering", Slug = "software-engineering" },
            ["AI & Machine Learning"] = new() { Name = "AI & Machine Learning", Slug = "ai-machine-learning" },
            ["Data Science"] = new() { Name = "Data Science", Slug = "data-science" },
            ["Cloud & DevOps"] = new() { Name = "Cloud & DevOps", Slug = "cloud-devops" },
            ["Cybersecurity"] = new() { Name = "Cybersecurity", Slug = "cybersecurity" }
        };

        if (!await context.Categories.AnyAsync())
        {
            await context.Categories.AddRangeAsync(categories.Values);
            await context.SaveChangesAsync();
        }
        else
        {
            var dbCategories = await context.Categories.ToListAsync();
            foreach (var cat in dbCategories)
            {
                if (categories.ContainsKey(cat.Name))
                {
                    categories[cat.Name] = cat;
                }
            }
        }

        var now = DateTimeOffset.UtcNow;

        // 1. Seed Courses
        var courseMap = new Dictionary<string, Course>();

        var coursesData = new List<(string key, string title, string slug, string desc, string category, decimal price, int daysUntilStart, string imageUrl)>
        {
            (
                "aspnet",
                "ASP.NET Core & Enterprise Microservices Masterclass",
                "aspnet-core-enterprise",
                "Architect high-performance distributed systems using .NET 10, EF Core code-first migrations, SQL Server, Clean Architecture, and Redis caching.",
                "Software Engineering",
                750m,
                8, "/images/SoftwareEngineering.jpg"
            ),
            (
                "react",
                "Modern Full-Stack React 19 & TypeScript Systems Architecture",
                "react-fullstack-architecture",
                "Master Next.js App Router, React Server Components, state management, full-stack typed APIs, and scalable modular design systems.",
                "Software Engineering",
                680m,
                13, "/images/SoftwareEngineering.jpg"
            ),
            (
                "genai",
                "Applied Generative AI, LLMs & Autonomous Agents Bootcamp",
                "applied-genai-llm",
                "Build production-ready agentic AI systems using LangChain, vector databases, RAG architectures, and fine-tuned open-source LLMs.",
                "AI & Machine Learning",
                950m,
                24, "/images/GenerativeAi.jpg"
            ),
            (
                "datascience",
                "Data Science & Machine Learning Engineering Specialization",
                "data-science-ml",
                "Master statistical machine learning with Python, Pandas, Scikit-Learn, PyTorch neural networks, feature engineering, and production MLOps.",
                "Data Science",
                820m,
                33, "/images/GenerativeAi.jpg"
            ),
            (
                "bigdata",
                "Big Data Engineering with Apache Spark & Google BigQuery",
                "bigdata-spark-bigquery",
                "Process massive streaming datasets using Apache Spark, build scalable cloud data warehouses on BigQuery, and automate enterprise DBT pipelines.",
                "Data Science",
                890m,
                21, "/images/DataScience.jpg"
            ),
            (
                "devops",
                "Cloud-Native Kubernetes, Terraform & DevOps Orchestration",
                "kubernetes-devops-cloud",
                "Provision cloud environments with Terraform, orchestrate containerized microservices in production Kubernetes, and automate GitHub Actions CI/CD.",
                "Cloud & DevOps",
                790m,
                38, "/images/CloudComputing.jpg"
            ),
            (
                "cybersec",
                "Enterprise Cybersecurity, Penetration Testing & DevSecOps",
                "cybersecurity-devsecops",
                "Master hands-on penetration testing, OWASP Top 10 mitigation, Zero-Trust network architecture, SOC threat hunting, and automated DevSecOps pipelines.",
                "Cybersecurity",
                850m,
                28, "/images/Cybersecurity.jpg"
            )
        };

        // foreach (var (key, title, slug, desc, catName, price, daysUntilStart) in coursesData)
        // {
        //     var existingCourse = await context.Courses.FirstOrDefaultAsync(c => c.Slug == slug);
        //     if (existingCourse == null)
        //     {
        //         var course = new Course
        //         {
        //             Title = title,
        //             Slug = slug,
        //             Description = desc,
        //             PublicationStatus = "Published"
        //         };
        //         await context.Courses.AddAsync(course);

        //         var courseCategory = new CourseCategory
        //         {
        //             CourseId = course.Id,
        //             CategoryId = categories[catName].Id,
        //             Sequence = 1
        //         };
        //         await context.CourseCategories.AddAsync(courseCategory);

        //         var offering = new Offering
        //         {
        //             Kind = "Course",
        //             CourseId = course.Id,
        //             StartsAt = now.AddDays(daysUntilStart),
        //             EndsAt = now.AddDays(daysUntilStart + 120),
        //             Price = price,
        //             Currency = "USD",
        //             Capacity = 30,
        //             Status = "Published"
        //         };
        //         await context.Offerings.AddAsync(offering);
        //         courseMap[key] = course;
        //     }
        //     else
        //     {
        //         courseMap[key] = existingCourse;
        //     }
        // }

        foreach (var (
    key, title, slug, desc, catName, price, daysUntilStart,imageUrl
) in coursesData)
{
    var course = await context.Courses
        .FirstOrDefaultAsync(c => c.Slug == slug);

    // Create the course if it doesn't exist.
    if (course == null)
    {
        course = new Course
        {
            Slug = slug
        };

        context.Courses.Add(course);
    }

    // Synchronize editable course content on every run.
    course.Title = title;
    course.Description = desc;
    course.ImageUrl = imageUrl;
    course.PublicationStatus = "Published";

    courseMap[key] = course;

    // Ensure the course has its category.
    var categoryId = categories[catName].Id;

    var hasCategory = await context.CourseCategories
        .AnyAsync(cc =>
            cc.CourseId == course.Id &&
            cc.CategoryId == categoryId);

    if (!hasCategory)
    {
        context.CourseCategories.Add(new CourseCategory
        {
            CourseId = course.Id,
            CategoryId = categoryId,
            Sequence = 1
        });
    }

    // Find the existing course offering.
    var offering = await context.Offerings
        .FirstOrDefaultAsync(o =>
            o.Kind == "Course" &&
            o.CourseId == course.Id);

    if (offering == null)
    {
        // Create an offering only if one doesn't exist.
        offering = new Offering
        {
            Kind = "Course",
            CourseId = course.Id,
            StartsAt = now.AddDays(daysUntilStart),
            EndsAt = now.AddDays(daysUntilStart + 120),
            Capacity = 30
        };

        context.Offerings.Add(offering);
    }

    offering.Price = price;
    offering.Currency = "USD";
    offering.Status = "Published";
}

await context.SaveChangesAsync();

        await context.SaveChangesAsync();

        // 2. Seed Programs
        var programMap = new Dictionary<string, Models.Catalog.Program>();

        var programsData = new List<(string key, string title, string slug, string desc, string category, decimal price, int daysUntilStart, List<string> courseKeys)>
        {
            (
                "fullstack-prog",
                "Full-Stack Software Engineering & Distributed Systems",
                "full-stack-software-engineering-systems",
                "Comprehensive degree-caliber program covering enterprise ASP.NET Core backends, React 19 frontend systems, Clean Architecture, and microservices.",
                "Software Engineering",
                2400m,
                14,
                new List<string> { "aspnet", "react", "devops" }
            ),
            (
                "ai-prog",
                "Applied Generative AI & Autonomous Agentic Systems",
                "applied-generative-ai-agentic-systems",
                "Master LLMs, fine-tuning, retrieval-augmented generation (RAG), autonomous multi-agent systems, and PyTorch deep learning architectures.",
                "AI & Machine Learning",
                2800m,
                20,
                new List<string> { "genai", "datascience" }
            ),
            (
                "data-prog",
                "Data Science & Cloud Big Data Engineering",
                "data-science-big-data-engineering",
                "End-to-end data platform engineering: statistical machine learning, PySpark distributed computation, and BigQuery data warehousing.",
                "Data Science",
                2200m,
                25,
                new List<string> { "datascience", "bigdata" }
            ),
            (
                "devops-prog",
                "Cloud Infrastructure, Kubernetes & DevOps Orchestration",
                "cloud-infrastructure-kubernetes-devops",
                "Enterprise cloud infrastructure, container orchestration with Kubernetes, Infrastructure as Code with Terraform, and DevSecOps pipelines.",
                "Cloud & DevOps",
                2100m,
                18,
                new List<string> { "devops", "cybersec" }
            )
        };

        foreach (var (key, title, slug, desc, catName, price, daysUntilStart, courseKeys) in programsData)
        {
            var existingProg = await context.Programs.FirstOrDefaultAsync(p => p.Slug == slug);
            if (existingProg == null)
            {
                var program = new Models.Catalog.Program
                {
                    Title = title,
                    Slug = slug,
                    Description = desc,
                    PublicationStatus = "Published"
                };
                await context.Programs.AddAsync(program);

                var progCategory = new ProgramCategory
                {
                    ProgramId = program.Id,
                    CategoryId = categories[catName].Id,
                    Sequence = 1
                };
                await context.ProgramCategories.AddAsync(progCategory);

                int seq = 1;
                foreach (var cKey in courseKeys)
                {
                    if (courseMap.TryGetValue(cKey, out var course))
                    {
                        await context.ProgramCourses.AddAsync(new ProgramCourse
                        {
                            ProgramId = program.Id,
                            CourseId = course.Id,
                            Sequence = seq++,
                            IsRequired = true
                        });
                    }
                }

                var offering = new Offering
                {
                    Kind = "Program",
                    ProgramId = program.Id,
                    StartsAt = now.AddDays(daysUntilStart),
                    EndsAt = now.AddDays(daysUntilStart + 180),
                    Price = price,
                    Currency = "USD",
                    Capacity = 25,
                    Status = "Published"
                };
                await context.Offerings.AddAsync(offering);
                programMap[key] = program;
            }
            else
            {
                programMap[key] = existingProg;
            }
        }

        await context.SaveChangesAsync();

        // 3. Seed Career Paths
        var careerPathsData = new List<(string title, string slug, string desc, List<string> programKeys, List<string> courseKeys)>
        {
            (
                "Full-Stack Enterprise Systems Architect",
                "full-stack-systems-architect",
                "Master high-scale backend microservices, modern frontend web architectures, and cloud-native Kubernetes deployment pipelines.",
                new List<string> { "fullstack-prog", "devops-prog" },
                new List<string> { "aspnet", "react", "devops" }
            ),
            (
                "Applied AI & Autonomous Systems Engineer",
                "applied-ai-systems-engineer",
                "Design and deploy production-grade generative AI applications, agentic workflows, custom vector databases, and neural models.",
                new List<string> { "ai-prog", "data-prog" },
                new List<string> { "genai", "datascience" }
            ),
            (
                "Cloud Platform & Big Data Engineering Lead",
                "cloud-platform-big-data-lead",
                "Build petabyte-scale data pipelines, automate cloud infrastructure, and manage distributed data lakes on GCP and Azure.",
                new List<string> { "data-prog", "devops-prog" },
                new List<string> { "bigdata", "devops" }
            ),
            (
                "Enterprise Cybersecurity & DevSecOps Specialist",
                "cybersecurity-devsecops-specialist",
                "Defend enterprise distributed systems, orchestrate Zero-Trust architectures, and automate compliance across CI/CD environments.",
                new List<string> { "devops-prog" },
                new List<string> { "cybersec", "devops" }
            )
        };

        foreach (var (title, slug, desc, progKeys, cKeys) in careerPathsData)
        {
            if (!await context.CareerPaths.AnyAsync(cp => cp.Slug == slug))
            {
                var cp = new CareerPath
                {
                    Title = title,
                    Slug = slug,
                    Description = desc
                };
                await context.CareerPaths.AddAsync(cp);

                int seqP = 1;
                foreach (var pKey in progKeys)
                {
                    if (programMap.TryGetValue(pKey, out var prog))
                    {
                        await context.CareerPathPrograms.AddAsync(new CareerPathProgram
                        {
                            CareerPathId = cp.Id,
                            ProgramId = prog.Id,
                            Sequence = seqP++
                        });
                    }
                }

                int seqC = 1;
                foreach (var cKey in cKeys)
                {
                    if (courseMap.TryGetValue(cKey, out var course))
                    {
                        await context.CareerPathCourses.AddAsync(new CareerPathCourse
                        {
                            CareerPathId = cp.Id,
                            CourseId = course.Id,
                            Sequence = seqC++
                        });
                    }
                }
            }
        }

        await context.SaveChangesAsync();
    }
}
