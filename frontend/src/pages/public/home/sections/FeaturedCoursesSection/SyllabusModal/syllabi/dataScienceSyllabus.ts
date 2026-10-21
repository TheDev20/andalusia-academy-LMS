import { ProgramSyllabusDetails } from "./types";

export const dataScienceSyllabus: ProgramSyllabusDetails = {
  courseId: "data-science-ml",
  title: "Data Science & Machine Learning Engineering Specialization",
  category: "Data Science",
  badge: "INDUSTRY CERTIFIED",
  duration: "6 Months · 190 Lab Hours",
  intake: "Nov 10, 2026",
  rating: 4.94,
  reviewsCount: 96,
  level: "Data Professionals",
  format: "Hybrid · Analytics Lab & Weekend Deep-Dives",
  overview:
    "A rigorous, mathematically grounded program transforming data analysts and developers into Lead Data Scientists and Machine Learning Engineers capable of training, tuning, and deploying production predictive pipelines.",
  careerOutcomes: {
    targetRoles: [
      "Lead Machine Learning Engineer",
      "Senior Data Scientist",
      "Applied AI Researcher",
      "MLOps Platform Specialist",
    ],
    averageSalaryRange: "$90,000 – $140,000 / yr",
    hiringPartners: ["Enterprise Analytics Hubs", "FinTech Giants", "Healthcare Tech Labs", "Global Advisory Firms"],
  },
  prerequisites: [
    "Foundational Python skills (loops, functions, libraries)",
    "Basic college-level mathematics (linear algebra, derivatives, statistics)",
    "Experience querying tabular data with SQL or Excel",
  ],
  technologies: [
    "Python 3.12",
    "NumPy",
    "Pandas",
    "Scikit-Learn",
    "PyTorch",
    "XGBoost",
    "LightGBM",
    "Optuna",
    "MLflow",
    "FastAPI",
    "Docker",
    "Evidently AI",
  ],
  modules: [
    {
      id: "mod-1",
      number: 1,
      duration: "Weeks 1–5",
      title: "Statistical Inference & Advanced Exploratory Data Analysis",
      summary:
        "Formulate rigorous hypotheses, conduct A/B testing power analysis, and uncover actionable insights from messy real-world datasets.",
      topics: [
        "Probability distributions, central limit theorem, and confidence intervals",
        "Frequentist vs Bayesian statistical inference & A/B testing power calculations",
        "Advanced data wrangling with Pandas: Multi-indexing, window functions & vectorized operations",
        "Exploratory Data Analysis (EDA) pipelines and automated profiling",
        "Interactive data storytelling with Plotly, Seaborn, and statistical visualizations",
      ],
      handsOnLab: {
        title: "Healthcare Clinical Trial Statistical Efficacy Analysis",
        description:
          "Analyze clinical trial datasets across 50,000 patient records, calculating statistical significance, confounding variables, and survival rate distributions.",
      },
      technologies: ["Python", "NumPy", "Pandas", "SciPy", "Statsmodels", "Plotly"],
    },
    {
      id: "mod-2",
      number: 2,
      duration: "Weeks 6–12",
      title: "Supervised & Unsupervised Machine Learning Systems",
      summary:
        "Master regression, classification, clustering, ensemble modeling, and state-of-the-art gradient boosted trees.",
      topics: [
        "Linear regression, regularizations (Ridge/Lasso/ElasticNet), and logistic classification",
        "Tree-based algorithms: Decision trees, Random Forests, and Gradient Boosting (XGBoost, LightGBM, CatBoost)",
        "Feature engineering: Target encoding, interaction terms, PCA dimensionality reduction, and t-SNE",
        "Unsupervised learning: K-Means, DBSCAN, Gaussian Mixture Models & anomaly detection",
        "Hyperparameter optimization with Bayesian search using Optuna",
      ],
      handsOnLab: {
        title: "Credit Card Fraud Anomaly Detection & Churn Engine",
        description:
          "Train an ensemble model on highly imbalanced fraud data (0.17% positive rate), engineering 35+ behavioral features and achieving a 0.94 Precision-Recall AUC score.",
      },
      technologies: ["Scikit-Learn", "XGBoost", "LightGBM", "Optuna", "SHAP"],
    },
    {
      id: "mod-3",
      number: 3,
      duration: "Weeks 13–18",
      title: "Deep Learning Foundations & Neural Networks with PyTorch",
      summary:
        "Build and train multi-layer perceptrons, convolutional neural networks, and sequence models using PyTorch.",
      topics: [
        "Neural network mathematics: Forward pass, backpropagation, and gradient descent optimization (AdamW)",
        "Overfitting mitigations: Dropout, batch normalization, weight decay & early stopping",
        "Convolutional Neural Networks (CNNs) for computer vision and transfer learning with ResNet",
        "Recurrent networks & LSTMs for time-series forecasting and sequence modeling",
        "Explainable AI: Model interpretability using SHAP values, LIME, and feature attribution",
      ],
      handsOnLab: {
        title: "Industrial Sensor Fault Prediction & Anomaly Forecaster",
        description:
          "Build an LSTM neural network that monitors multi-sensor factory IoT telemetry, predicting mechanical component failures 72 hours before breakdown.",
      },
      technologies: ["PyTorch", "Torchvision", "CUDA", "TensorBoard", "SHAP"],
    },
    {
      id: "mod-4",
      number: 4,
      duration: "Weeks 19–24",
      title: "Production MLOps, CI/CD & Model Monitoring",
      summary:
        "Take models from Jupyter notebooks into production containerized APIs with automated data drift and performance monitoring.",
      topics: [
        "Experiment tracking and model versioning with MLflow Model Registry",
        "Packaging models into high-performance REST APIs with FastAPI and Pydantic validation",
        "Containerizing inference services with multi-stage Docker builds",
        "Data drift and model decay detection with Evidently AI and Prometheus metrics",
        "Automated model retraining pipelines triggered by performance degradation",
      ],
      handsOnLab: {
        title: "End-to-End Automated MLOps Deployment with Live Drift Alerts",
        description:
          "Package a trained customer churn model into a Dockerized FastAPI service, instrument with MLflow tracking, and configure automated alerts when input feature distributions drift over 15%.",
      },
      technologies: ["MLflow", "FastAPI", "Docker", "Evidently AI", "GitHub Actions"],
    },
  ],
  capstoneProject: {
    title: "Predictive Healthcare Triage & Patient Risk Stratification Platform",
    description:
      "Fellows engineer an end-to-end clinical machine learning solution that predicts 30-day hospital readmission risks, providing doctors with explainable feature breakdowns and live probability scores.",
    deliverables: [
      "Rigorous EDA report with statistical hypotheses testing",
      "Optimized ensemble model with Optuna hyperparameter tuning",
      "Dockerized REST API serving live predictions in sub-15ms",
      "Evidently AI dashboard monitoring real-time data drift and fairness metrics",
    ],
  },
};
