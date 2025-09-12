import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronDown, 
  X, 
  MapPin, 
  Users, 
  TreePine, 
  Home, 
  Calendar,
  FileText,
  Award,
  Layers,
  ZoomIn
} from 'lucide-react';

const Atlas = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [currentZoom, setCurrentZoom] = useState(7);
  const layersRef = useRef({});

  // Sample data structure with updated schemes and additional plots
  const stateData = {
    'Odisha': {
      center: [20.9517, 85.0985],
      zoom: 7,
      districts: {
        'Mayurbhanj': {
          center: [21.9287, 86.7410],
          zoom: 11,
          villages: ['Kendumundi'],
          plots: [
            {
              id: 'MYB001',
              coordinates: [21.9287, 86.7410],
              title: 'IFR Plot - Jashipur Block',
              pattalolder: 'Ramesh Murmu',
              area: '2.5 acres',
              type: 'Individual Forest Rights (IFR)',
              status: 'Granted',
              grantDate: '2019-03-15',
              village: 'Kendumundi',
              block: 'Jashipur',
              surveyNumber: 'SF-145/2',
              tribe: 'Santhal',
              assets: ['Agricultural Land', 'Forest Cover', 'Water Body'],
              schemes: ['PM-KISAN', 'PMFBY', 'PMKSY', 'Soil Health Card'],
              coordinates_detail: '21°55\'N, 86°44\'E'
            },
            {
              id: 'MYB002',
              coordinates: [21.9277, 86.7400],
              title: 'CFR Area - Similipal Buffer',
              pattalolder: 'Kendumundi Gram Sabha',
              area: '156.8 acres',
              type: 'Community Forest Resource (CFR)',
              status: 'Under Process',
              grantDate: 'Pending',
              village: 'Kendumundi',
              block: 'Jashipur',
              surveyNumber: 'RF-89/5',
              tribe: 'Multiple Tribes',
              assets: ['Dense Forest', 'Stream', 'NTFP Areas'],
              schemes: ['MSP for MFP', 'Van Dhan Vikas', 'National Bamboo Mission'],
              coordinates_detail: '21°51\'N, 86°40\'E'
            },
            {
              id: 'MYB003',
              coordinates: [21.9297, 86.7420],
              title: 'IFR Plot - Jashipur North',
              pattalolder: 'Sita Soren',
              area: '3.0 acres',
              type: 'Individual Forest Rights (IFR)',
              status: 'Granted',
              grantDate: '2020-01-10',
              village: 'Kendumundi',
              block: 'Jashipur',
              surveyNumber: 'SF-146/3',
              tribe: 'Santhal',
              assets: ['Agricultural Land', 'Orchard', 'Pond'],
              schemes: ['PM-KISAN', 'PMFBY', 'PMKSY', 'Soil Health Card'],
              coordinates_detail: '21°55\'N, 86°44\'E'
            },
            {
              id: 'MYB004',
              coordinates: [21.9267, 86.7390],
              title: 'CFR Plot - Similipal South',
              pattalolder: 'Similipal Gram Sabha',
              area: '200.0 acres',
              type: 'Community Forest Resource (CFR)',
              status: 'Pending',
              grantDate: 'Pending',
              village: 'Kendumundi',
              block: 'Jashipur',
              surveyNumber: 'RF-90/6',
              tribe: 'Multiple Tribes',
              assets: ['Forest', 'Water Body', 'NTFP Areas'],
              schemes: ['MSP for MFP', 'Van Dhan Vikas', 'National Bamboo Mission'],
              coordinates_detail: '21°51\'N, 86°40\'E'
            },
            {
              id: 'MYB005',
              coordinates: [21.9280, 86.7415],
              title: 'IFR Plot - Jashipur East',
              pattalolder: 'Rajesh Murmu',
              area: '1.8 acres',
              type: 'Individual Forest Rights (IFR)',
              status: 'Granted',
              grantDate: '2021-04-05',
              village: 'Kendumundi',
              block: 'Jashipur',
              surveyNumber: 'SF-147/4',
              tribe: 'Santhal',
              assets: ['Agricultural Land', 'Trees', 'Well'],
              schemes: ['PM-KISAN', 'PMFBY', 'PMKSY'],
              coordinates_detail: '21°55\'N, 86°44\'E'
            }
          ]
        },
        'Keonjhar': {
          center: [21.6297, 85.5804],
          zoom: 11,
          villages: ['Joda'],
          plots: [
            {
              id: 'KEO001',
              coordinates: [21.6297, 85.5804],
              title: 'IFR Plot - Champua Block',
              pattalolder: 'Sunita Munda',
              area: '1.8 acres',
              type: 'Individual Forest Rights (IFR)',
              status: 'Granted',
              grantDate: '2020-07-22',
              village: 'Joda',
              block: 'Champua',
              surveyNumber: 'SF-234/1',
              tribe: 'Munda',
              assets: ['Agricultural Land', 'Fruit Trees', 'Well'],
              schemes: ['PM-KISAN', 'PMFBY', 'PMKSY', 'Kisan Credit Card'],
              coordinates_detail: '21°37\'N, 85°34\'E'
            },
            {
              id: 'KEO002',
              coordinates: [21.6287, 85.5794],
              title: 'IFR Plot - Champua East',
              pattalolder: 'Rahul Munda',
              area: '2.0 acres',
              type: 'Individual Forest Rights (IFR)',
              status: 'Under Process',
              grantDate: 'Pending',
              village: 'Joda',
              block: 'Champua',
              surveyNumber: 'SF-235/2',
              tribe: 'Munda',
              assets: ['Agricultural Land', 'Trees', 'Pond'],
              schemes: ['PM-KISAN', 'PMFBY', 'PMKSY', 'Soil Health Card'],
              coordinates_detail: '21°37\'N, 85°34\'E'
            },
            {
              id: 'KEO003',
              coordinates: [21.6307, 85.5814],
              title: 'CFR Plot - Joda West',
              pattalolder: 'Joda Gram Sabha',
              area: '50.0 acres',
              type: 'Community Forest Resource (CFR)',
              status: 'Granted',
              grantDate: '2021-03-10',
              village: 'Joda',
              block: 'Champua',
              surveyNumber: 'RF-236/3',
              tribe: 'Multiple Tribes',
              assets: ['Forest', 'Stream', 'NTFP Areas'],
              schemes: ['MSP for MFP', 'Van Dhan Vikas', 'National Bamboo Mission'],
              coordinates_detail: '21°37\'N, 85°34\'E'
            },
            {
              id: 'KEO004',
              coordinates: [21.6290, 85.5809],
              title: 'IFR Plot - Joda South',
              pattalolder: 'Priya Munda',
              area: '2.5 acres',
              type: 'Individual Forest Rights (IFR)',
              status: 'Under Process',
              grantDate: 'Pending',
              village: 'Joda',
              block: 'Champua',
              surveyNumber: 'SF-237/4',
              tribe: 'Munda',
              assets: ['Agricultural Land', 'Orchard', 'Well'],
              schemes: ['PM-KISAN', 'PMFBY', 'Kisan Credit Card'],
              coordinates_detail: '21°37\'N, 85°34\'E'
            }
          ]
        },
        'Koraput': {
          center: [18.8103, 82.7110],
          zoom: 11,
          villages: ['Nandapur'],
          plots: [
            {
              id: 'KOR001',
              coordinates: [18.8103, 82.7110],
              title: 'CR Rights - Nandapur Block',
              pattalolder: 'Nandapur Village Committee',
              area: '45.2 acres',
              type: 'Community Rights (CR)',
              status: 'Granted',
              grantDate: '2018-11-08',
              village: 'Nandapur',
              block: 'Nandapur',
              surveyNumber: 'CR-67/3',
              tribe: 'Kondh',
              assets: ['Bamboo Grove', 'Sacred Grove', 'Ponds'],
              schemes: ['MSP for MFP', 'Van Dhan Vikas', 'National Bamboo Mission', 'MGNREGA'],
              coordinates_detail: '18°48\'N, 82°42\'E'
            },
            {
              id: 'KOR002',
              coordinates: [18.8113, 82.7120],
              title: 'IFR Plot - Nandapur South',
              pattalolder: 'Laxmi Kondh',
              area: '2.0 acres',
              type: 'Individual Forest Rights (IFR)',
              status: 'Under Process',
              grantDate: 'Pending',
              village: 'Nandapur',
              block: 'Nandapur',
              surveyNumber: 'SF-68/4',
              tribe: 'Kondh',
              assets: ['Agricultural Land', 'Bamboo', 'Well'],
              schemes: ['PM-KISAN', 'PMFBY', 'PMKSY', 'Kisan Credit Card'],
              coordinates_detail: '18°48\'N, 82°42\'E'
            },
            {
              id: 'KOR003',
              coordinates: [18.8093, 82.7100],
              title: 'CFR Plot - Nandapur East',
              pattalolder: 'Nandapur Gram Sabha',
              area: '60.0 acres',
              type: 'Community Forest Resource (CFR)',
              status: 'Granted',
              grantDate: '2019-05-15',
              village: 'Nandapur',
              block: 'Nandapur',
              surveyNumber: 'RF-69/5',
              tribe: 'Multiple Tribes',
              assets: ['Forest', 'Ponds', 'NTFP Areas'],
              schemes: ['MSP for MFP', 'Van Dhan Vikas', 'National Bamboo Mission'],
              coordinates_detail: '18°48\'N, 82°42\'E'
            },
            {
              id: 'KOR004',
              coordinates: [18.8108, 82.7115],
              title: 'IFR Plot - Nandapur North',
              pattalolder: 'Ramesh Kondh',
              area: '1.5 acres',
              type: 'Individual Forest Rights (IFR)',
              status: 'Granted',
              grantDate: '2020-08-18',
              village: 'Nandapur',
              block: 'Nandapur',
              surveyNumber: 'SF-70/6',
              tribe: 'Kondh',
              assets: ['Agricultural Land', 'Trees', 'Pond'],
              schemes: ['PM-KISAN', 'PMFBY', 'PMKSY'],
              coordinates_detail: '18°48\'N, 82°42\'E'
            }
          ]
        },
        'Nabarangapur': {
          center: [19.2282, 82.5476],
          zoom: 11,
          villages: ['Kodinga'],
          plots: [
            {
              id: 'NAB001',
              coordinates: [19.2282, 82.5476],
              title: 'IFR Plot - Kodinga Block',
              pattalolder: 'Badar Jani',
              area: '2.2 acres',
              type: 'Individual Forest Rights (IFR)',
              status: 'Granted',
              grantDate: '2020-02-20',
              village: 'Kodinga',
              block: 'Kosagumuda',
              surveyNumber: 'SF-101/1',
              tribe: 'Bhatra',
              assets: ['Agricultural Land', 'Trees', 'Pond'],
              schemes: ['PM-KISAN', 'PMFBY', 'PMKSY', 'Kisan Credit Card'],
              coordinates_detail: '19°13\'N, 82°32\'E',
              pdf_url: 'https://odishaforestgis.in/ofms/uploads/fra/8354/Badar%20Jani%20-%204844.pdf'
            },
            {
              id: 'NAB002',
              coordinates: [19.2272, 82.5466],
              title: 'CFR Plot - Kodinga West',
              pattalolder: 'Kodinga Gram Sabha',
              area: '80.0 acres',
              type: 'Community Forest Resource (CFR)',
              status: 'Under Process',
              grantDate: 'Pending',
              village: 'Kodinga',
              block: 'Kosagumuda',
              surveyNumber: 'RF-102/2',
              tribe: 'Multiple Tribes',
              assets: ['Forest', 'Stream', 'NTFP Areas'],
              schemes: ['MSP for MFP', 'Van Dhan Vikas', 'National Bamboo Mission', 'PM PVTG/PM-JANMAN'],
              coordinates_detail: '19°13\'N, 82°32\'E'
            },
            {
              id: 'NAB003',
              coordinates: [19.2292, 82.5486],
              title: 'IFR Plot - Kodinga East',
              pattalolder: 'Sita Bhatra',
              area: '1.5 acres',
              type: 'Individual Forest Rights (IFR)',
              status: 'Granted',
              grantDate: '2021-06-12',
              village: 'Kodinga',
              block: 'Kosagumuda',
              surveyNumber: 'SF-103/3',
              tribe: 'Bhatra',
              assets: ['Agricultural Land', 'Bamboo', 'Well'],
              schemes: ['PM-KISAN', 'PMFBY', 'PMKSY', 'Kisan Credit Card'],
              coordinates_detail: '19°13\'N, 82°32\'E'
            },
            {
              id: 'NAB004',
              coordinates: [19.2287, 82.5471],
              title: 'CR Plot - Kodinga North',
              pattalolder: 'Kodinga Committee',
              area: '45.0 acres',
              type: 'Community Rights (CR)',
              status: 'Granted',
              grantDate: '2022-01-15',
              village: 'Kodinga',
              block: 'Kosagumuda',
              surveyNumber: 'CR-104/4',
              tribe: 'Multiple Tribes',
              assets: ['Bamboo Grove', 'Sacred Grove', 'Ponds'],
              schemes: ['MSP for MFP', 'Van Dhan Vikas', 'MGNREGA'],
              coordinates_detail: '19°13\'N, 82°32\'E'
            }
          ]
        }
      }
    }
  };

  // Village data for all villages
  const villageData = {
    'Kendumundi': {
      'State Name': 'ODISHA',
      'District Name': 'Mayurbhanj',
      'Sub District Name': 'Kendumundi',
      'Village Name': 'Kendumundi',
      'CD Block Name': 'Jashipur',
      'Gram Panchayat Name': 'Kendumundi',
      'Sub District Head Quarter': 'Jashipur',
      'District Head Quarter': 'Baripada',
      'Nearest Statutory Town': 'Baripada',
      'Within the State/UT': 'MAYURBHANJ',
      'Total Geographical Area (Hectares)': 850.0,
      'Total Population': 3200,
      'Total Male Population': 1620.0,
      'Total Female Population': 1580.0,
      'Total Scheduled Castes Population': 450.0,
      'Total Scheduled Castes Male Population': 230.0,
      'Total Scheduled Castes Female Population': 220.0,
      'Total Scheduled Tribes Population': 1200.0,
      'Total Scheduled Tribes Male Population': 610.0,
      'Total Scheduled Tribes Female Population': 590.0,
      'Nearest Town Name': 'Baripada',
      'Total Sanitation Campaign Status': 'A(1)',
      'Telephone (landlines) Status': 'A(1)',
      'Power Supply For Agriculture Use Status': 'A(1)',
      'Power Supply For Agriculture Summer (Hours)': 12.0,
      'Power Supply For Agriculture Winter (Hours)': 14.0,
      'Forest Area (Hectares)': 300.0,
      'Area under Non-Agricultural Uses (Hectares)': 15.0,
      'Barren & Un-cultivable Land Area (Hectares)': 25.0,
      'Permanent Pastures and Other Grazing Land Area (Hectares)': 10.0,
      'Land Under Miscellaneous Tree Crops etc. Area (Hectares)': 50.0,
      'Culturable Waste Land Area (Hectares)': 5.0,
      'Fallows Land other than Current Fallows Area (Hectares)': 15.0,
      'Current Fallows Area (Hectares)': 10.0,
      'Net Area Sown (Hectares)': 400.0,
      'Total Unirrigated Land Area (Hectares)': 380.0,
      'Area Irrigated by Source (Hectares)': 20.0,
      'Canals Area (Hectares)': 10.0,
      'Wells/Tube Wells Area (Hectares)': 5.0,
      'Tanks/Lakes Area (Hectares)': 5.0,
      'Waterfall Area (Hectares)': 0.0,
      'Other Source Area (Hectares)': 0.0
    },
    'Joda': {
      'State Name': 'ODISHA',
      'District Name': 'Keonjhar',
      'Sub District Name': 'Joda',
      'Village Name': 'Joda',
      'CD Block Name': 'Champua',
      'Gram Panchayat Name': 'Joda',
      'Sub District Head Quarter': 'Joda',
      'District Head Quarter': 'Keonjhar',
      'Nearest Statutory Town': 'Keonjhar',
      'Within the State/UT': 'KEONJHAR',
      'Total Geographical Area (Hectares)': 1200.0,
      'Total Population': 4500,
      'Total Male Population': 2280.0,
      'Total Female Population': 2220.0,
      'Total Scheduled Castes Population': 600.0,
      'Total Scheduled Castes Male Population': 310.0,
      'Total Scheduled Castes Female Population': 290.0,
      'Total Scheduled Tribes Population': 1500.0,
      'Total Scheduled Tribes Male Population': 750.0,
      'Total Scheduled Tribes Female Population': 750.0,
      'Nearest Town Name': 'Keonjhar',
      'Total Sanitation Campaign Status': 'A(1)',
      'Telephone (landlines) Status': 'A(1)',
      'Power Supply For Agriculture Use Status': 'A(1)',
      'Power Supply For Agriculture Summer (Hours)': 16.0,
      'Power Supply For Agriculture Winter (Hours)': 18.0,
      'Forest Area (Hectares)': 400.0,
      'Area under Non-Agricultural Uses (Hectares)': 20.0,
      'Barren & Un-cultivable Land Area (Hectares)': 30.0,
      'Permanent Pastures and Other Grazing Land Area (Hectares)': 15.0,
      'Land Under Miscellaneous Tree Crops etc. Area (Hectares)': 60.0,
      'Culturable Waste Land Area (Hectares)': 8.0,
      'Fallows Land other than Current Fallows Area (Hectares)': 18.0,
      'Current Fallows Area (Hectares)': 12.0,
      'Net Area Sown (Hectares)': 550.0,
      'Total Unirrigated Land Area (Hectares)': 500.0,
      'Area Irrigated by Source (Hectares)': 50.0,
      'Canals Area (Hectares)': 20.0,
      'Wells/Tube Wells Area (Hectares)': 15.0,
      'Tanks/Lakes Area (Hectares)': 10.0,
      'Waterfall Area (Hectares)': 0.0,
      'Other Source Area (Hectares)': 5.0
    },
    'Nandapur': {
      'State Name': 'ODISHA',
      'District Name': 'Koraput',
      'Sub District Name': 'Nandapur',
      'Village Name': 'Nandapur',
      'CD Block Name': 'Nandapur',
      'Gram Panchayat Name': 'Nandapur',
      'Sub District Head Quarter': 'Nandapur',
      'District Head Quarter': 'Jeypore',
      'Nearest Statutory Town': 'Jeypore',
      'Within the State/UT': 'KORAPUT',
      'Total Geographical Area (Hectares)': 950.0,
      'Total Population': 3800,
      'Total Male Population': 1920.0,
      'Total Female Population': 1880.0,
      'Total Scheduled Castes Population': 500.0,
      'Total Scheduled Castes Male Population': 260.0,
      'Total Scheduled Castes Female Population': 240.0,
      'Total Scheduled Tribes Population': 1300.0,
      'Total Scheduled Tribes Male Population': 650.0,
      'Total Scheduled Tribes Female Population': 650.0,
      'Nearest Town Name': 'Jeypore',
      'Total Sanitation Campaign Status': 'A(1)',
      'Telephone (landlines) Status': 'A(1)',
      'Power Supply For Agriculture Use Status': 'A(1)',
      'Power Supply For Agriculture Summer (Hours)': 14.0,
      'Power Supply For Agriculture Winter (Hours)': 16.0,
      'Forest Area (Hectares)': 350.0,
      'Area under Non-Agricultural Uses (Hectares)': 18.0,
      'Barren & Un-cultivable Land Area (Hectares)': 28.0,
      'Permanent Pastures and Other Grazing Land Area (Hectares)': 12.0,
      'Land Under Miscellaneous Tree Crops etc. Area (Hectares)': 55.0,
      'Culturable Waste Land Area (Hectares)': 6.0,
      'Fallows Land other than Current Fallows Area (Hectares)': 16.0,
      'Current Fallows Area (Hectares)': 11.0,
      'Net Area Sown (Hectares)': 450.0,
      'Total Unirrigated Land Area (Hectares)': 420.0,
      'Area Irrigated by Source (Hectares)': 30.0,
      'Canals Area (Hectares)': 15.0,
      'Wells/Tube Wells Area (Hectares)': 8.0,
      'Tanks/Lakes Area (Hectares)': 7.0,
      'Waterfall Area (Hectares)': 0.0,
      'Other Source Area (Hectares)': 0.0
    },
    'Kodinga': {
      'State Name': 'ODISHA',
      'District Name': 'Nabarangapur',
      'Sub District Name': 'Kodinga',
      'Village Name': 'Kodinga',
      'CD Block Name': 'Kosagumuda',
      'Gram Panchayat Name': 'Kodinga',
      'Sub District Head Quarter': 'Kodinga',
      'District Head Quarter': 'Nabarangapur',
      'Nearest Statutory Town': 'NABARANGAPUR',
      'Within the State/UT': 'NABARANGAPUR',
      'Total Geographical Area (Hectares)': 1064.0,
      'Total Population': 4092,
      'Total Male Population': 2067.0,
      'Total Female Population': 2025.0,
      'Total Scheduled Castes Population': 629.0,
      'Total Scheduled Castes Male Population': 324.0,
      'Total Scheduled Castes Female Population': 305.0,
      'Total Scheduled Tribes Population': 1403.0,
      'Total Scheduled Tribes Male Population': 699.0,
      'Total Scheduled Tribes Female Population': 704.0,
      'Nearest Town Name': 'NABARANGAPUR',
      'Total Sanitation Campaign Status': 'A(1)',
      'Telephone (landlines) Status': 'A(1)',
      'Power Supply For Agriculture Use Status': 'A(1)',
      'Power Supply For Agriculture Summer (Hours)': 18.0,
      'Power Supply For Agriculture Winter (Hours)': 20.0,
      'Forest Area (Hectares)': 373.03,
      'Area under Non-Agricultural Uses (Hectares)': 19.03,
      'Barren & Un-cultivable Land Area (Hectares)': 32.8,
      'Permanent Pastures and Other Grazing Land Area (Hectares)': 18.0,
      'Land Under Miscellaneous Tree Crops etc. Area (Hectares)': 87.24,
      'Culturable Waste Land Area (Hectares)': 1.85,
      'Fallows Land other than Current Fallows Area (Hectares)': 20.39,
      'Current Fallows Area (Hectares)': 14.0,
      'Net Area Sown (Hectares)': 497.66,
      'Total Unirrigated Land Area (Hectares)': 497.66,
      'Area Irrigated by Source (Hectares)': 0.0,
      'Canals Area (Hectares)': 0.0,
      'Wells/Tube Wells Area (Hectares)': 0.0,
      'Tanks/Lakes Area (Hectares)': 0.0,
      'Waterfall Area (Hectares)': 0.0,
      'Other Source Area (Hectares)': 0.0
    }
  };

  useEffect(() => {
    const loadLeaflet = async () => {
      if (!window.L) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = initializeMap;
        document.body.appendChild(script);
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (mapRef.current && window.L && !map) {
        const newMap = window.L.map(mapRef.current, {
          zoomControl: true,
          minZoom: 5,
          maxZoom: 18
        }).setView([20.9517, 85.0985], 7);
        
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(newMap);

        newMap.on('zoomend', () => {
          setCurrentZoom(newMap.getZoom());
        });

        setMap(newMap);
      }
    };

    loadLeaflet();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  // Zoom to state on selection
  useEffect(() => {
    if (!map || !selectedState) return;

    const state = stateData[selectedState];
    map.setView(state.center, state.zoom);

    Object.values(layersRef.current).forEach(layer => {
      if (layer && map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    });
    layersRef.current = {};
    setSelectedDistrict('');
    setSelectedVillage('');
    setSidebarOpen(false);
    setSelectedPlot(null);
  }, [map, selectedState]);

  // Zoom to district on selection
  useEffect(() => {
    if (!map || !selectedDistrict || !selectedState) return;

    const districtData = stateData[selectedState].districts[selectedDistrict];
    map.setView(districtData.center, districtData.zoom);

    Object.values(layersRef.current).forEach(layer => {
      if (layer && map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    });
    layersRef.current = {};
    setSelectedVillage('');
    setSidebarOpen(false);
    setSelectedPlot(null);
  }, [map, selectedState, selectedDistrict]);

  // Zoom to village and show sidebar on selection
  useEffect(() => {
    if (!map || !selectedVillage || !selectedDistrict || !selectedState) return;

    const districtData = stateData[selectedState].districts[selectedDistrict];
    const villagePlots = districtData.plots.filter(plot => plot.village === selectedVillage);
    if (villagePlots.length > 0) {
      const villageCenter = villagePlots[0].coordinates;
      map.setView(villageCenter, 12);
    }

    Object.values(layersRef.current).forEach(layer => {
      if (layer && map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    });
    layersRef.current = {};
    setSelectedPlot(null);
    setSidebarOpen(true);
  }, [map, selectedState, selectedDistrict, selectedVillage]);

  // Add plot markers only after village selection
  useEffect(() => {
    if (!map || !selectedVillage || !selectedDistrict || !selectedState) return;

    Object.keys(layersRef.current).forEach(key => {
      if (layersRef.current[key] && map.hasLayer(layersRef.current[key])) {
        map.removeLayer(layersRef.current[key]);
      }
    });
    layersRef.current = {};

    const districtData = stateData[selectedState].districts[selectedDistrict];
    const plotsToShow = districtData.plots.filter(plot => plot.village === selectedVillage);

    plotsToShow.forEach(plot => {
      const plotIcon = window.L.divIcon({
        className: 'plot-marker',
        html: `<div style="
          width: 20px; 
          height: 20px; 
          background-color: ${plot.status === 'Granted' ? '#10b981' : plot.status === 'Under Process' ? '#f59e0b' : '#ef4444'}; 
          border: 2px solid white; 
          border-radius: 50%; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          cursor: pointer;
        "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
      });

      const marker = window.L.marker(plot.coordinates, { icon: plotIcon })
        .addTo(map)
        .bindPopup(`<b>${plot.title}</b><br/>Status: ${plot.status}`)
        .on('click', () => {
          setSelectedPlot(plot);
          setSidebarOpen(true);
        });
      
      layersRef.current[plot.id] = marker;
    });
  }, [map, selectedState, selectedDistrict, selectedVillage]);

  const handleStateChange = (state) => {
    setSelectedState(state);
    setSelectedDistrict('');
    setSelectedVillage('');
    setSidebarOpen(false);
    setSelectedPlot(null);
  };

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
    setSelectedVillage('');
    setSidebarOpen(false);
    setSelectedPlot(null);
  };

  const handleVillageChange = (village) => {
    setSelectedVillage(village);
    setSelectedPlot(null);
    setSidebarOpen(!!village);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Granted': return 'text-green-600 bg-green-100';
      case 'Under Process': return 'text-yellow-600 bg-yellow-100';
      case 'Pending': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Individual Forest Rights (IFR)': return <Home className="w-4 h-4" />;
      case 'Community Rights (CR)': return <Users className="w-4 h-4" />;
      case 'Community Forest Resource (CFR)': return <TreePine className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 relative">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex-shrink-0 z-20 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">FRA Atlas</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select State</option>
                  {Object.keys(stateData).map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>

              <div className="relative">
                <select
                  value={selectedDistrict}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  disabled={!selectedState}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select District</option>
                  {selectedState && Object.keys(stateData[selectedState].districts).map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>

              <div className="relative">
                <select
                  value={selectedVillage}
                  onChange={(e) => handleVillageChange(e.target.value)}
                  disabled={!selectedDistrict}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select Village</option>
                  {selectedDistrict && stateData[selectedState].districts[selectedDistrict].villages.map(village => (
                    <option key={village} value={village}>{village}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Layers className="w-4 h-4" />
              <span>Zoom: {currentZoom}</span>
            </div>
            {selectedVillage && (
              <div className="text-sm text-gray-600">
                Plots: {stateData[selectedState]?.districts[selectedDistrict]?.plots.filter(plot => plot.village === selectedVillage).length || 0}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden">
        <div 
          ref={mapRef} 
          className="w-full h-full"
          style={{ 
            background: '#f8fafc',
            zIndex: 10
          }}
        />

        {/* Plot Table View */}
        {selectedVillage && (
          <div className="absolute bottom-4 left-4 w-96 max-h-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900">Plots in {selectedVillage}, {selectedDistrict}</h4>
            </div>
            <div className="grid grid-cols-1 gap-4 p-4">
              {(() => {
                const districtData = stateData[selectedState].districts[selectedDistrict];
                const plotsToShow = districtData.plots.filter(plot => plot.village === selectedVillage);
                return plotsToShow.map(plot => (
                  <div
                    key={plot.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedPlot(plot);
                      setSidebarOpen(true);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${plot.status === 'Granted' ? 'bg-green-500' : plot.status === 'Under Process' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{plot.title}</p>
                        <p className="text-xs text-gray-500">{plot.type} • {plot.status}</p>
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}

        {/* Sidebar */}
        {sidebarOpen && (
          <div className="absolute right-4 top-4 bottom-4 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 flex flex-col">
            {selectedPlot ? (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center relative">
                      {getTypeIcon(selectedPlot.type)}
                      <span className="text-white text-xs font-bold absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">{selectedPlot.id}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{selectedPlot.title}</h3>
                      <p className="text-sm text-gray-600">{selectedPlot.village}, {selectedPlot.block}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedPlot.status)}`}>
                      {selectedPlot.status}
                    </span>
                    <span className="text-sm text-gray-500">{selectedPlot.coordinates_detail}</span>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Basic Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Patta Holder</p>
                        <p className="text-sm font-medium text-gray-900">{selectedPlot.pattalolder}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Area</p>
                        <p className="text-sm font-medium text-gray-900">{selectedPlot.area}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Survey Number</p>
                        <p className="text-sm font-medium text-gray-900">{selectedPlot.surveyNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Tribal Community</p>
                        <p className="text-sm font-medium text-gray-900">{selectedPlot.tribe}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Rights Type</p>
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(selectedPlot.type)}
                        <span className="text-sm font-medium text-gray-900">{selectedPlot.type}</span>
                      </div>
                    </div>

                    {selectedPlot.grantDate !== 'Pending' && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Grant Date</p>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {new Date(selectedPlot.grantDate).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Mapped Assets</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlot.assets.map((asset, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                        >
                          {asset}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Eligible CSS Schemes</h4>
                    <div className="space-y-2">
                      {selectedPlot.schemes.map((scheme, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200"
                        >
                          <Award className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium text-gray-900">{scheme}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <a 
                      href={selectedPlot.pdf_url || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>View Documents</span>
                    </a>
                    <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                      <ZoomIn className="w-4 h-4" />
                      <span>Satellite View</span>
                    </button>
                  </div>
                </div>
              </>
            ) : selectedVillage && villageData[selectedVillage] ? (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{selectedVillage}</h3>
                      <p className="text-sm text-gray-600">{selectedDistrict}, {selectedState}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Village Details</h4>
                  <div className="space-y-2">
                    {Object.entries(villageData[selectedVillage]).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-xs text-gray-500">{key}</span>
                        <span className="text-sm font-medium text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}

        {selectedState && (
          <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-20">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Legend</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-green-500 rounded-full border-3 border-white shadow-md"></div>
                <span className="text-xs text-gray-700">Granted Rights</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-yellow-500 rounded-full border-3 border-white shadow-md"></div>
                <span className="text-xs text-gray-700">Under Process</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-red-500 rounded-full border-3 border-white shadow-md"></div>
                <span className="text-xs text-gray-700">Pending/Rejected</span>
              </div>
            </div>
          </div>
        )}

        {!selectedState && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Welcome to FRA Atlas</h3>
              <p className="text-gray-600 mb-6">
                Select a state, district, and village from the dropdown menus above to explore Forest Rights Act data and visualize land plots.
              </p>
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <TreePine className="w-4 h-4" />
                <span>Start by selecting Odisha from the state dropdown</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Atlas;