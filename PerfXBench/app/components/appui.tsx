"use client";

import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import BarChartComponent from './BarChart'
import { useEffect, useState } from 'react';

type ModelData = {
    model_name: string;
    metrics: {
      [key: string]: {
        value: number;
        unit: string;
      };
    };
  };

const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Leaderboard', href: '#', current: false },
]


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}



export default function Dashboard() {
    const [models, setModels] = useState<ModelData[]>([]);
    const [groupedMetrics, setGroupedMetrics] = useState<{ [key: string]: { name: string; value: number; unit: string }[] }>({});
    useEffect(() => {
        fetch('/api/models') // Fetch from backend
          .then((response) => response.json())
          .then((data) => {
            if (data.models) {
              setModels(data.models);
    
              // Group metrics by type (latency, throughput, etc.)
              const metricCategories: { [key: string]: { name: string; value: number; unit: string }[] } = {};
    
              data.models.forEach((model: ModelData) => {
                Object.keys(model.metrics).forEach((metricKey) => {
                  if (!metricCategories[metricKey]) {
                    metricCategories[metricKey] = [];
                  }
                  metricCategories[metricKey].push({
                    name: model.model_name,
                    value: model.metrics[metricKey].value,
                    unit: model.metrics[metricKey].unit,
                  });
                });
              });
    
              setGroupedMetrics(metricCategories);
              console.log('Grouped Metrics:', metricCategories); 
            }
          })
          .catch((error) => console.error('Error loading JSON data:', error));
      }, []);
  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
      
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        aria-current={item.current ? 'page' : undefined}
                        className={classNames(
                          item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium',
                        )}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          
        </Disclosure>

        <header className="bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Performance Benchmark</h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {Object.keys(groupedMetrics).length === 0 ? (
              <p className="text-white text-center">Loading model data...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.keys(groupedMetrics).map((metricKey, index) => (
                  <div key={index} className="bg-gray-900 p-4 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-white mb-4">{metricKey}</h3>
                    <BarChartComponent metricKey={metricKey} metricData={groupedMetrics[metricKey]} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
        


      </div>
      
    </>
  )
}
