# TradeApollo

TradeApollo is a Next.js-based dashboard application that allows users to explore residential electricity prices and carbon intensity data across different countries and regions. The application utilizes various APIs to fetch real-time data and provides an interactive map interface for easy navigation.

## Features

- Interactive world map displaying electricity zones and countries
- Real-time residential electricity price search based on country, zipcode, and total kW usage
- Live carbon intensity data for selected electricity zones
- Live power breakdown by source for selected electricity zones
- Historical pricing data visualization with line charts
- Export pricing data as CSV
- Responsive design for seamless usage across devices

## Technologies Used

- Next.js: A React framework for building server-side rendered and static web applications
- React: A JavaScript library for building user interfaces
- TypeScript: A typed superset of JavaScript that compiles to plain JavaScript
- Mapbox GL JS: A JavaScript library for interactive, customizable vector maps
- react-map-gl: A React wrapper for Mapbox GL JS
- Recharts: A composable charting library built on React components
- NextUI: A beautiful, fast, and modern React UI library
- Tailwind CSS: A utility-first CSS framework for rapidly building custom user interfaces
- Framer Motion: A production-ready motion library for React
- Moment.js: A JavaScript library for parsing, validating, manipulating, and formatting dates

## Getting Started

To run the TradeApollo application locally, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/your-username/tradeapollo.git
```

2. Install the dependencies:

```bash
cd tradeapollo
npm install
```

3. Set up the required environment variables:

- Create a `.env.local` file in the root directory of the project
- Add the following variables:
  ```
  NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
  ```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000` to see the application.

## API Endpoints

The TradeApollo application relies on the following API endpoints:

- Residential Electricity Prices: You need to run the backend API program.
- Carbon Intensity Data: `https://api.electricitymap.org/v3/carbon-intensity/latest`
- Power Breakdown Data: `https://api.electricitymap.org/v3/power-breakdown/latest`
- Historical Pricing Data: You need to run the backend API program.

Make sure you have the necessary API tokens and permissions to access these endpoints.

## Contributing

Contributions to TradeApollo are welcome! If you encounter any issues or have suggestions for improvements, please open an issue on the GitHub repository. If you'd like to contribute code changes, please follow these steps:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes and commit them with descriptive commit messages
4. Push your changes to your forked repository
5. Open a pull request to the main repository, describing your changes in detail

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
