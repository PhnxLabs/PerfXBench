# Performance Benchmark Dashboard

This is an app to show core performance benchmark of ML models for comparision

A dark mode performance benchmark dashboard built with Next.js, React, Tailwind CSS, Recharts, and Headless UI. This minimalist application displays performance metrics for various models using interactive bar charts.

Sample:
<img width="1272" alt="image" src="https://github.com/user-attachments/assets/247ccbad-bb81-4183-acf3-d233ee08e40e" />

## Features

- **Dark Mode & Minimalist Design:** A sleek, high-contrast interface for modern data visualization.
- **Dynamic Data Loading:** Fetches and groups performance metrics from JSON files stored in `public/data`.
- **Interactive Charts:** Displays performance metrics with Recharts, featuring tooltips and responsive design.
- **Clean Navigation:** Uses Headless UI components for a smooth navigation experience.

## Project Structure

- **`appui.tsx`**  
  The main dashboard component that:
  - Fetches performance metrics from the API.
  - Groups metrics by type (e.g., latency, throughput).
  - Displays each metric in a responsive card with a bar chart.

- **`BarChart.tsx`**  
  A reusable bar chart component that:
  - Renders data using Recharts.
  - Includes custom tooltips and dynamic color accents.

- **`route.ts`**  
  The API route that:
  - Reads JSON files from the `public/data` directory.
  - Returns the performance data as JSON.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- Package Manager: [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/performance-benchmark-dashboard.git
   cd performance-benchmark-dashboard
   ```

2. **Install Dependencies:**

   Using npm:
   ```bash
   npm install
   ```
   Or using Yarn:
   ```bash
   yarn install
   ```

3. **Add Your Data:**

   Place your JSON benchmark files into the `public/data` directory. Each JSON file should follow a structure similar to:
   ```json
   {
     "model_name": "BERT-Base",
     "metrics": {
       "latency": {
         "value": 200,
         "unit": "ms"
       }
     }
   }
   ```

### Running the Project

Start the development server:

Using npm:
```bash
npm run dev
```
Or using Yarn:
```bash
yarn dev
```

Then, open [http://localhost:3000](http://localhost:3000) in your browser to view the dashboard.

### Building for Production

To build and run the application in production mode:

Using npm:
```bash
npm run build
npm start
```
Or using Yarn:
```bash
yarn build
yarn start
```

## Customization

- **Styling:**  
  The project uses [Tailwind CSS](https://tailwindcss.com/). Modify the Tailwind classes in your components to adjust the design.
  
- **Data Fetching:**  
  The API route (`route.ts`) loads JSON data from the `public/data` directory. Adjust this logic if you need to source data differently.

- **Chart Customization:**  
  The bar charts are rendered using [Recharts](https://recharts.org/). For more customization options, refer to the Recharts documentation.

## Contributing

Contributions are welcome! If you have suggestions or improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Headless UI](https://headlessui.com/)
- [Recharts](https://recharts.org/)
- [Heroicons](https://heroicons.com/)
