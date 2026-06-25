import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Component pour Onglet AUDIT - Analyses Hydraulique et Énergétique Avancées
const AuditSystem = () => {
  const [activeAuditTab, setActiveAuditTab] = useState('hydraulic');
  const [hydraulicAuditData, setHydraulicAuditData] = useState({
    // Données installation existante
    installation_age: '',
    installation_type: 'surface',
    pump_manufacturer: '',
    pump_model: '',
    pump_serial: '',
    motor_manufacturer: '',
    motor_power_rated: '',
    motor_current_rated: '',
    
    // Conditions d'exploitation actuelles
    current_flow_rate: '',
    current_head: '',
    current_efficiency: '',
    operating_hours_daily: '',
    operating_days_yearly: '',
    
    // Mesures techniques relevées
    suction_pressure: '',
    discharge_pressure: '',
    motor_current: '',
    motor_voltage: '',
    vibration_level: '',
    noise_level: '',
    temperature_motor: '',
    temperature_bearing: '',
    
    // Observations visuelles
    leakage_present: false,
    corrosion_level: 'none',
    alignment_status: 'good',
    coupling_condition: 'good',
    foundation_status: 'good',
    
    // Maintenance historique
    last_maintenance: '',
    maintenance_frequency: 'monthly',
    replacement_parts: [],
    
    // Problèmes signalés
    reported_issues: [],
    performance_degradation: false,
    energy_consumption_increase: false
  });

  const [energyAuditData, setEnergyAuditData] = useState({
    // Données énergétiques
    electricity_tariff: '96',
    peak_hours_tariff: '150',
    off_peak_tariff: '75',
    demand_charge: '8000',
    
    // Profil d'exploitation
    peak_hours_daily: '8',
    off_peak_hours_daily: '16',
    seasonal_variation: 'none',
    load_factor: '0.75',
    
    // Mesures énergétiques
    power_consumption_measured: '',
    power_factor_measured: '',
    energy_monthly_kwh: '',
    energy_cost_monthly: '',
    
    // Équipements auxiliaires
    control_system: 'basic',
    variable_frequency_drive: false,
    soft_starter: false,
    pressure_tank: false,
    automation_level: 'manual',
    
    // Objectifs d'amélioration
    target_energy_savings: '20',
    payback_period_max: '3',
    investment_budget: '',
    
    // Contraintes opérationnelles
    shutdown_windows: 'weekends',
    safety_requirements: [],
    environmental_constraints: []
  });

  const [auditResults, setAuditResults] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  // Options pour les dropdowns
  const corrosionLevels = [
    { value: 'none', label: 'Aucune corrosion visible' },
    { value: 'light', label: 'Corrosion légère' },
    { value: 'moderate', label: 'Corrosion modérée' },
    { value: 'severe', label: 'Corrosion sévère' }
  ];

  const conditionStatuses = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Bon' },
    { value: 'fair', label: 'Acceptable' },
    { value: 'poor', label: 'Médiocre' },
    { value: 'critical', label: 'Critique' }
  ];

  const maintenanceFrequencies = [
    { value: 'weekly', label: 'Hebdomadaire' },
    { value: 'monthly', label: 'Mensuelle' },
    { value: 'quarterly', label: 'Trimestrielle' },
    { value: 'biannual', label: 'Semestrielle' },
    { value: 'annual', label: 'Annuelle' }
  ];

  const controlSystems = [
    { value: 'basic', label: 'Démarrage direct' },
    { value: 'soft_starter', label: 'Démarreur progressif' },
    { value: 'vfd', label: 'Variateur de fréquence' },
    { value: 'pressure_control', label: 'Régulation de pression' },
    { value: 'flow_control', label: 'Régulation de débit' }
  ];

  // Fonction d'analyse experte des données d'audit
  const performExpertAuditAnalysis = async () => {
    setLoadingAnalysis(true);
    
    try {
      // Simulation d'analyse experte (en réalité, cela utiliserait l'API backend)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Générer les résultats d'audit basés sur les données
      const results = generateAuditResults();
      setAuditResults(results);
    } catch (error) {
      console.error('Erreur analyse audit:', error);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const generatePriorityActions = () => [
    'Remplacement immédiat des pièces critiques usées',
    'Correction de l\'alignement pompe-moteur', 
    'Installation d\'un système de surveillance vibratoire',
    'Optimisation du programme de maintenance préventive'
  ];

  const generateCostEstimates = () => ({
    immediate_repairs: 15000,
    preventive_maintenance: 8000,
    efficiency_upgrades: 25000,
    monitoring_systems: 12000
  });

  const generateImprovementMeasures = () => [
    {
      measure: 'Installation variateur de fréquence',
      savings_percentage: 25,
      cost: 35000,
      payback_months: 14
    },
    {
      measure: 'Optimisation régulation pression',
      savings_percentage: 15,
      cost: 18000,
      payback_months: 18
    },
    {
      measure: 'Amélioration facteur puissance',
      savings_percentage: 8,
      cost: 12000,
      payback_months: 24
    }
  ];

  const generatePaybackAnalysis = () => ({
    total_investment: 65000,
    annual_savings: 230400,
    simple_payback_months: 3.4,
    npv_5_years: 890000,
    irr_percentage: 42
  });

  const determineInvestmentPriority = () => {
    const hydraulicScore = calculateHydraulicScore();
    const energyScore = calculateEnergyScore();
    
    if (hydraulicScore < 60 && energyScore < 60) return 'Critique - Intervention immédiate';
    if (hydraulicScore < 75 || energyScore < 75) return 'Élevée - Planifier sous 6 mois';
    return 'Modérée - Optimisation continue';
  };

  const generateImplementationRoadmap = () => [
    { phase: 'Phase 1 (0-3 mois)', actions: ['Réparations critiques', 'Maintenance corrective'] },
    { phase: 'Phase 2 (3-6 mois)', actions: ['Installation variateur', 'Optimisation contrôle'] },
    { phase: 'Phase 3 (6-12 mois)', actions: ['Système monitoring', 'Formation équipes'] }
  ];

  const calculateHydraulicScore = () => {
    let score = 100;
    
    // Pénalités basées sur les conditions
    if (hydraulicAuditData.corrosion_level === 'moderate') score -= 15;
    if (hydraulicAuditData.corrosion_level === 'severe') score -= 30;
    if (hydraulicAuditData.alignment_status === 'poor') score -= 20;
    if (hydraulicAuditData.coupling_condition === 'poor') score -= 15;
    if (hydraulicAuditData.leakage_present) score -= 10;
    if (hydraulicAuditData.performance_degradation) score -= 25;
    
    // Bonus pour bonne maintenance
    if (hydraulicAuditData.maintenance_frequency === 'monthly') score += 5;
    if (hydraulicAuditData.maintenance_frequency === 'weekly') score += 10;
    
    return Math.max(20, Math.min(100, score));
  };

  const calculateEnergyScore = () => {
    let score = 100;
    
    // Pénalités énergétiques
    if (!energyAuditData.variable_frequency_drive && activeAuditTab === 'energy') score -= 25;
    if (parseFloat(energyAuditData.power_factor_measured) < 0.9) score -= 15;
    if (energyAuditData.control_system === 'basic') score -= 20;
    if (energyAuditData.energy_consumption_increase) score -= 20;
    
    // Bonus pour équipements efficaces
    if (energyAuditData.variable_frequency_drive) score += 15;
    if (energyAuditData.automation_level === 'advanced') score += 10;
    
    return Math.max(30, Math.min(100, score));
  };

  const getPerformanceRating = (score) => {
    if (score >= 90) return { level: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 75) return { level: 'Bon', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (score >= 60) return { level: 'Acceptable', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    if (score >= 40) return { level: 'Médiocre', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    return { level: 'Critique', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const generateHydraulicFindings = () => [
    {
      category: 'Performance Hydraulique',
      finding: hydraulicAuditData.performance_degradation 
        ? 'Dégradation des performances détectée par rapport aux spécifications nominales'
        : 'Performances hydrauliques dans la plage acceptable',
      severity: hydraulicAuditData.performance_degradation ? 'high' : 'low',
      impact: hydraulicAuditData.performance_degradation 
        ? 'Augmentation de la consommation énergétique et réduction de la durée de vie'
        : 'Impact limité sur l\'efficacité globale'
    },
    {
      category: 'État Mécanique',
      finding: `Corrosion ${hydraulicAuditData.corrosion_level}, alignement ${hydraulicAuditData.alignment_status}`,
      severity: hydraulicAuditData.corrosion_level === 'severe' ? 'high' : 'medium',
      impact: 'Influence directe sur la fiabilité et la maintenance préventive'
    },
    {
      category: 'Maintenance Préventive',
      finding: `Fréquence actuelle: ${hydraulicAuditData.maintenance_frequency}`,
      severity: hydraulicAuditData.maintenance_frequency === 'annual' ? 'medium' : 'low',
      impact: 'Optimisation possible du programme de maintenance'
    }
  ];

  const generateHydraulicRecommendations = () => [
    {
      priority: 'Haute',
      action: 'Remplacement des pièces d\'usure critiques',
      description: 'Remplacer les joints, roulements et garnitures mécaniques',
      cost_range: '2 000 - 5 000 FCFA',
      timeline: '1-2 semaines',
      benefits: 'Amélioration fiabilité +30%, réduction fuites'
    },
    {
      priority: 'Moyenne',
      action: 'Optimisation de l\'alignement pompe-moteur',
      description: 'Contrôle et correction de l\'alignement avec instruments de précision',
      cost_range: '500 - 1 500 FCFA',
      timeline: '2-3 jours',
      benefits: 'Réduction vibrations -40%, augmentation durée de vie +25%'
    },
    {
      priority: 'Basse',
      action: 'Amélioration du programme de maintenance préventive',
      description: 'Mise en place d\'un planning de maintenance prédictive',
      cost_range: '1 000 - 3 000 FCFA',
      timeline: '1 mois',
      benefits: 'Réduction pannes imprévues -50%, optimisation coûts'
    }
  ];

  const generateEnergyAnalysis = () => ({
    current_consumption: parseFloat(energyAuditData.energy_monthly_kwh) || 1200,
    current_cost: parseFloat(energyAuditData.energy_cost_monthly) || 115200,
    efficiency_current: 75,
    efficiency_potential: 90,
    load_profile: 'Variable avec pics en journée',
    power_quality: parseFloat(energyAuditData.power_factor_measured) || 0.85
  });

  const generateSavingsPotential = () => ({
    annual_savings_kwh: 2400,
    annual_savings_fcfa: 230400,
    co2_reduction_kg: 1680,
    payback_months: 18,
    roi_percentage: 35
  });

  const generateAuditResults = () => {
    const hydraulicScore = calculateHydraulicScore();
    const energyScore = calculateEnergyScore();
    
    return {
      hydraulic_audit: {
        overall_score: hydraulicScore,
        performance_rating: getPerformanceRating(hydraulicScore),
        key_findings: generateHydraulicFindings(),
        recommendations: generateHydraulicRecommendations(),
        priority_actions: generatePriorityActions(),
        cost_estimates: generateCostEstimates()
      },
      energy_audit: {
        overall_score: energyScore,
        efficiency_rating: getPerformanceRating(energyScore),
        energy_analysis: generateEnergyAnalysis(),
        savings_potential: generateSavingsPotential(),
        improvement_measures: generateImprovementMeasures(),
        payback_analysis: generatePaybackAnalysis()
      },
      combined_analysis: {
        total_score: Math.round((hydraulicScore + energyScore) / 2),
        investment_priority: determineInvestmentPriority(),
        implementation_roadmap: generateImplementationRoadmap()
      }
    };
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">🔧 SYSTÈME D'AUDIT HYDRAULIQUE & ÉNERGÉTIQUE</h2>
        <p className="text-indigo-100">
          Analyses techniques approfondies pour optimisation performance et efficacité énergétique
        </p>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>✅ Audit ISO 50001</div>
          <div>✅ Standards IEC 60034</div>
          <div>✅ Normes ASHRAE</div>
          <div>✅ Certification ENERGY STAR</div>
        </div>
      </div>

      {/* Navigation sous-onglets */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveAuditTab('hydraulic')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeAuditTab === 'hydraulic'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🔧 Audit Hydraulique
            </button>
            <button
              onClick={() => setActiveAuditTab('energy')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeAuditTab === 'energy'
                  ? 'border-green-500 text-green-600 bg-green-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              ⚡ Audit Énergétique
            </button>
            <button
              onClick={() => setActiveAuditTab('results')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeAuditTab === 'results'
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              disabled={!auditResults}
            >
              📊 Résultats & Recommandations
            </button>
          </nav>
        </div>

        {/* Contenu des sous-onglets */}
        <div className="p-6">
          {activeAuditTab === 'hydraulic' && (
            <div className="space-y-8">
              <h3 className="text-xl font-bold text-gray-900">🔧 Audit Hydraulique Détaillé</h3>
              
              {/* Section 1: Installation existante */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">📋 Données Installation Existante</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Âge installation (années)</label>
                    <input
                      type="number"
                      value={hydraulicAuditData.installation_age}
                      onChange={(e) => setHydraulicAuditData(prev => ({...prev, installation_age: e.target.value}))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: 5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type installation</label>
                    <select
                      value={hydraulicAuditData.installation_type}
                      onChange={(e) => setHydraulicAuditData(prev => ({...prev, installation_type: e.target.value}))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="surface">Pompe de surface</option>
                      <option value="submersible">Pompe immergée</option>
                      <option value="inline">Pompe en ligne</option>
                      <option value="booster">Station de reprise</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fabricant pompe</label>
                    <input
                      type="text"
                      value={hydraulicAuditData.pump_manufacturer}
                      onChange={(e) => setHydraulicAuditData(prev => ({...prev, pump_manufacturer: e.target.value}))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Grundfos, KSB, Pedrollo"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Conditions d'exploitation */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">⚙️ Conditions d'Exploitation Actuelles</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Débit actuel (m³/h)</label>
                    <input
                      type="number"
                      value={hydraulicAuditData.current_flow_rate}
                      onChange={(e) => setHydraulicAuditData(prev => ({...prev, current_flow_rate: e.target.value}))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: 45"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">HMT actuelle (m)</label>
                    <input
                      type="number"
                      value={hydraulicAuditData.current_head}
                      onChange={(e) => setHydraulicAuditData(prev => ({...prev, current_head: e.target.value}))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: 32"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rendement estimé (%)</label>
                    <input
                      type="number"
                      value={hydraulicAuditData.current_efficiency}
                      onChange={(e) => setHydraulicAuditData(prev => ({...prev, current_efficiency: e.target.value}))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: 75"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heures/jour</label>
                    <input
                      type="number"
                      value={hydraulicAuditData.operating_hours_daily}
                      onChange={(e) => setHydraulicAuditData(prev => ({...prev, operating_hours_daily: e.target.value}))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: 12"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Observations visuelles */}
              <div className="bg-yellow-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">👁️ Observations Visuelles et État</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Niveau de corrosion</label>
                    <select
                      value={hydraulicAuditData.corrosion_level}
                      onChange={(e) => setHydraulicAuditData(prev => ({...prev, corrosion_level: e.target.value}))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      {corrosionLevels.map(level => (
                        <option key={level.value} value={level.value}>{level.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">État alignement</label>
                    <select
                      value={hydraulicAuditData.alignment_status}
                      onChange={(e) => setHydraulicAuditData(prev => ({...prev, alignment_status: e.target.value}))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      {conditionStatuses.map(status => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Condition accouplement</label>
                    <select
                      value={hydraulicAuditData.coupling_condition}
                      onChange={(e) => setHydraulicAuditData(prev => ({...prev, coupling_condition: e.target.value}))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      {conditionStatuses.map(status => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={hydraulicAuditData.leakage_present}
                      onChange={(e) => setHydraulicAuditData(prev => ({...prev, leakage_present: e.target.checked}))}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Fuites détectées</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={hydraulicAuditData.performance_degradation}
                      onChange={(e) => setHydraulicAuditData(prev => ({...prev, performance_degradation: e.target.checked}))}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Dégradation des performances</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeAuditTab === 'energy' && (
            <div className="space-y-8">
              <h3 className="text-xl font-bold text-gray-900">⚡ Audit Énergétique Approfondi</h3>
              
              {/* Section 1: Tarification électrique */}
              <div className="bg-green-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">💰 Structure Tarifaire Électrique</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tarif moyen (FCFA/kWh)</label>
                    <input
                      type="number"
                      value={energyAuditData.electricity_tariff}
                      onChange={(e) => setEnergyAuditData(prev => ({...prev, electricity_tariff: e.target.value}))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      placeholder="96"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heures pleines (FCFA/kWh)</label>
                    <input
                      type="number"
                      value={energyAuditData.peak_hours_tariff}
                      onChange={(e) => setEnergyAuditData(prev => ({...prev, peak_hours_tariff: e.target.value}))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      placeholder="150"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heures creuses (FCFA/kWh)</label>
                    <input
                      type="number"
                      value={energyAuditData.off_peak_tariff}
                      onChange={(e) => setEnergyAuditData(prev => ({...prev, off_peak_tariff: e.target.value}))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      placeholder="75"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prime puissance (FCFA/kW/mois)</label>
                    <input
                      type="number"
                      value={energyAuditData.demand_charge}
                      onChange={(e) => setEnergyAuditData(prev => ({...prev, demand_charge: e.target.value}))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      placeholder="8000"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Mesures énergétiques */}
              <div className="bg-purple-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">📊 Mesures Énergétiques Actuelles</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Consommation mesurée (kW)</label>
                    <input
                      type="number"
                      value={energyAuditData.power_consumption_measured}
                      onChange={(e) => setEnergyAuditData(prev => ({...prev, power_consumption_measured: e.target.value}))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                      placeholder="Ex: 8.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Facteur de puissance</label>
                    <input
                      type="number"
                      step="0.01"
                      value={energyAuditData.power_factor_measured}
                      onChange={(e) => setEnergyAuditData(prev => ({...prev, power_factor_measured: e.target.value}))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                      placeholder="Ex: 0.85"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Consommation mensuelle (kWh)</label>
                    <input
                      type="number"
                      value={energyAuditData.energy_monthly_kwh}
                      onChange={(e) => setEnergyAuditData(prev => ({...prev, energy_monthly_kwh: e.target.value}))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                      placeholder="Ex: 1200"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Équipements de contrôle */}
              <div className="bg-indigo-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">🎛️ Équipements de Contrôle et Automation</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Système de contrôle</label>
                    <select
                      value={energyAuditData.control_system}
                      onChange={(e) => setEnergyAuditData(prev => ({...prev, control_system: e.target.value}))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    >
                      {controlSystems.map(system => (
                        <option key={system.value} value={system.value}>{system.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Niveau automation</label>
                    <select
                      value={energyAuditData.automation_level}
                      onChange={(e) => setEnergyAuditData(prev => ({...prev, automation_level: e.target.value}))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="manual">Manuel</option>
                      <option value="basic">Basique (ON/OFF)</option>
                      <option value="intermediate">Intermédiaire (Seuils)</option>
                      <option value="advanced">Avancé (PID, IoT)</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={energyAuditData.variable_frequency_drive}
                      onChange={(e) => setEnergyAuditData(prev => ({...prev, variable_frequency_drive: e.target.checked}))}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Variateur fréquence</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={energyAuditData.soft_starter}
                      onChange={(e) => setEnergyAuditData(prev => ({...prev, soft_starter: e.target.checked}))}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Démarreur progressif</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={energyAuditData.pressure_tank}
                      onChange={(e) => setEnergyAuditData(prev => ({...prev, pressure_tank: e.target.checked}))}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Ballon surpresseur</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeAuditTab === 'results' && auditResults && (
            <div className="space-y-8">
              <h3 className="text-xl font-bold text-gray-900">📊 Résultats d'Audit et Recommandations</h3>
              
              {/* Scores globaux */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border-2 border-blue-200 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {auditResults.hydraulic_audit.overall_score}/100
                  </div>
                  <div className="text-lg font-medium text-gray-900 mb-1">Score Hydraulique</div>
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${auditResults.hydraulic_audit.performance_rating.bgColor} ${auditResults.hydraulic_audit.performance_rating.color}`}>
                    {auditResults.hydraulic_audit.performance_rating.level}
                  </div>
                </div>
                <div className="bg-white border-2 border-green-200 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {auditResults.energy_audit.overall_score}/100
                  </div>
                  <div className="text-lg font-medium text-gray-900 mb-1">Score Énergétique</div>
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${auditResults.energy_audit.efficiency_rating.bgColor} ${auditResults.energy_audit.efficiency_rating.color}`}>
                    {auditResults.energy_audit.efficiency_rating.level}
                  </div>
                </div>
                <div className="bg-white border-2 border-purple-200 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {auditResults.combined_analysis.total_score}/100
                  </div>
                  <div className="text-lg font-medium text-gray-900 mb-1">Score Global</div>
                  <div className="text-sm text-gray-600">Analyse combinée</div>
                </div>
              </div>

              {/* Recommandations hydrauliques */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="font-bold text-blue-900 mb-4">🔧 Recommandations Hydrauliques Prioritaires</h4>
                <div className="space-y-4">
                  {auditResults.hydraulic_audit.recommendations.map((rec, index) => (
                    <div key={index} className={`border-l-4 pl-4 ${
                      rec.priority === 'Haute' ? 'border-red-400 bg-red-50' :
                      rec.priority === 'Moyenne' ? 'border-yellow-400 bg-yellow-50' :
                      'border-green-400 bg-green-50'
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-gray-900">{rec.action}</h5>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          rec.priority === 'Haute' ? 'bg-red-200 text-red-800' :
                          rec.priority === 'Moyenne' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-green-200 text-green-800'
                        }`}>
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{rec.description}</p>
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div><strong>Coût:</strong> {rec.cost_range}</div>
                        <div><strong>Délai:</strong> {rec.timeline}</div>
                        <div><strong>Bénéfices:</strong> {rec.benefits}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analyse énergétique */}
              <div className="bg-green-50 rounded-lg p-6">
                <h4 className="font-bold text-green-900 mb-4">⚡ Potentiel d'Économies Énergétiques</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {auditResults.energy_audit.savings_potential?.annual_savings_kwh} kWh
                    </div>
                    <div className="text-sm text-gray-600">Économies annuelles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {auditResults.energy_audit.savings_potential?.annual_savings_fcfa.toLocaleString()} FCFA
                    </div>
                    <div className="text-sm text-gray-600">Économies financières</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {auditResults.energy_audit.savings_potential?.co2_reduction_kg} kg
                    </div>
                    <div className="text-sm text-gray-600">Réduction CO₂</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {auditResults.energy_audit.savings_potential?.payback_months} mois
                    </div>
                    <div className="text-sm text-gray-600">Retour investissement</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bouton d'analyse experte */}
      {(activeAuditTab === 'hydraulic' || activeAuditTab === 'energy') && (
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <button
            onClick={performExpertAuditAnalysis}
            disabled={loadingAnalysis}
            className={`px-8 py-4 rounded-lg font-bold text-lg ${
              loadingAnalysis
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
            } transition-all duration-300`}
          >
            {loadingAnalysis ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Analyse en cours...</span>
              </div>
            ) : (
              '🧠 LANCER ANALYSE EXPERTE'
            )}
          </button>
          <p className="text-sm text-gray-600 mt-2">
            Génération automatique de recommandations techniques et d'optimisations énergétiques
          </p>
        </div>
      )}
    </div>
  );
};

// Component pour Onglet EXPERT SOLAIRE - Dimensionnement Pompage Solaire
const SolarExpertSystem = () => {
  // États pour les données d'entrée
  const [solarData, setSolarData] = useState({
    // Informations du projet
    project_name: 'Système de Pompage Solaire',
    location_region: 'france',
    location_subregion: 'centre',
    
    // Besoins en eau et hydrauliques
    daily_water_need: 10,
    operating_hours: 8, // Nouvelles heures de fonctionnement
    flow_rate: 1.25, // m³/h - calculé automatiquement (10/8)
    seasonal_variation: 1.2,
    peak_months: [6, 7, 8],
    
    // Paramètres hydrauliques pour calcul HMT restructuré
    dynamic_level: 15, // Niveau dynamique (profondeur pompage)
    tank_height: 5, // Hauteur du château d'eau
    static_head: 20, // Hauteur géométrique (calculée auto: niveau + château)
    dynamic_losses: 5, // Pertes de charge dynamiques
    useful_pressure_head: 0, // Pression utile convertie en hauteur
    total_head: 25, // HMT totale calculée automatiquement
    pipe_diameter: 100, // DN calculé automatiquement basé sur débit
    pipe_length: 50, // Longueur estimée automatiquement basée sur géométrie
    
    // Paramètres solaires
    panel_peak_power: 400, // Wc - puissance crête panneau
    
    // Contraintes du système
    autonomy_days: 2,
    system_voltage: 24,
    installation_type: 'submersible',
    
    // Paramètres économiques
    electricity_cost: 0.15,
    project_lifetime: 25,
    maintenance_cost_annual: 0.02,
    
    // Contraintes d'installation
    available_surface: 100,
    max_budget: 15000,
    grid_connection_available: false,
    
    // Paramètres environnementaux
    ambient_temperature_avg: 25,
    dust_factor: 0.95,
    shading_factor: 1.0
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [availableRegions, setAvailableRegions] = useState([]);
  const [activeSection, setActiveSection] = useState('project');
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Charger les régions disponibles
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get(`${API}/solar-regions`);
        setAvailableRegions(response.data.regions);
      } catch (error) {
        console.error('Erreur lors du chargement des régions:', error);
      }
    };
    
    fetchRegions();
  }, []);

  // Calcul automatique en temps réel
  useEffect(() => {
    const calculateSolarSystem = async () => {
      if (solarData.daily_water_need > 0 && solarData.total_head > 0) {
        setLoading(true);
        try {
          const response = await axios.post(`${API}/solar-pumping`, solarData);
          setResults(response.data);
        } catch (error) {
          console.error('Erreur calcul solaire:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    const timer = setTimeout(calculateSolarSystem, 500);
    return () => clearTimeout(timer);
  }, [solarData]);

  // Mise à jour du graphique
  useEffect(() => {
    if (results && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 
                         'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: monthNames,
          datasets: [{
            label: 'Production Solaire (kWh/j)',
            data: results.monthly_performance.production,
            borderColor: '#F59E0B',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderWidth: 3,
            fill: true
          }, {
            label: 'Consommation Pompe (kWh/j)',
            data: results.monthly_performance.consumption,
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
            fill: true
          }, {
            label: 'Irradiation Solaire (kWh/m²/j)',
            data: results.monthly_performance.irradiation,
            borderColor: '#EF4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 2,
            yAxisID: 'y1'
          }]
        },
        options: {
          responsive: true,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            title: {
              display: true,
              text: 'Performance Mensuelle du Système Solaire'
            },
            legend: {
              position: 'top',
            }
          },
          scales: {
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              title: {
                display: true,
                text: 'Énergie (kWh/jour)'
              }
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              title: {
                display: true,
                text: 'Irradiation (kWh/m²/jour)'
              },
              grid: {
                drawOnChartArea: false,
              },
            }
          }
        }
      });
    }
  }, [results]);

  const handleInputChange = (field, value) => {
    setSolarData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Calcul automatique du débit basé sur les heures de fonctionnement
      if (field === 'daily_water_need' || field === 'operating_hours') {
        const volume = field === 'daily_water_need' ? value : prev.daily_water_need;
        const hours = field === 'operating_hours' ? value : prev.operating_hours;
        if (hours > 0) {
          updated.flow_rate = parseFloat((volume / hours).toFixed(2));
          
          // Calcul automatique du DN basé sur débit et vitesse recommandée 2 m/s
          const flowM3s = (updated.flow_rate / 3600); // m³/s
          const velocity = 2.0; // m/s vitesse recommandée
          const diameterM = Math.sqrt((4 * flowM3s) / (Math.PI * velocity)); // diamètre en mètres
          const diameterMM = diameterM * 1000; // en millimètres
          
          // Normalisation vers DN standard
          const standardDNs = [20, 25, 32, 40, 50, 63, 80, 100, 125, 150, 200, 250, 300];
          const recommendedDN = standardDNs.find(dn => dn >= diameterMM) || 300;
          updated.pipe_diameter = recommendedDN;
          
          // Estimation automatique longueur basée sur géométrie (hauteur × 1.5 pour trajets)
          updated.pipe_length = Math.max(30, prev.static_head * 1.5);
        }
      }
      
      // Calcul automatique du DN quand le débit change directement
      if (field === 'flow_rate') {
        const flowM3s = (value / 3600); // m³/s
        const velocity = 2.0; // m/s vitesse recommandée
        const diameterM = Math.sqrt((4 * flowM3s) / (Math.PI * velocity));
        const diameterMM = diameterM * 1000;
        
        const standardDNs = [20, 25, 32, 40, 50, 63, 80, 100, 125, 150, 200, 250, 300];
        const recommendedDN = standardDNs.find(dn => dn >= diameterMM) || 300;
        updated.pipe_diameter = recommendedDN;
      }
      
      // Calcul automatique de la hauteur géométrique
      if (field === 'dynamic_level' || field === 'tank_height') {
        const dynamicLevel = field === 'dynamic_level' ? value : prev.dynamic_level;
        const tankHeight = field === 'tank_height' ? value : prev.tank_height;
        updated.static_head = dynamicLevel + tankHeight;
        
        // Recalcul automatique HMT
        updated.total_head = updated.static_head + prev.dynamic_losses + prev.useful_pressure_head;
        
        // Recalcul automatique longueur conduite
        updated.pipe_length = Math.max(30, updated.static_head * 1.5);
      }
      
      // Recalcul automatique HMT pour autres champs
      if (field === 'dynamic_losses' || field === 'useful_pressure_head') {
        const losses = field === 'dynamic_losses' ? value : prev.dynamic_losses;
        const pressure = field === 'useful_pressure_head' ? value : prev.useful_pressure_head;
        updated.total_head = prev.static_head + losses + pressure;
      }
      
      return updated;
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(value);
  };

  const getSolarRadiationColor = (irradiation) => {
    if (irradiation >= 6) return 'text-red-600 font-bold';
    if (irradiation >= 4.5) return 'text-orange-600 font-semibold';
    if (irradiation >= 3.5) return 'text-yellow-600';
    return 'text-blue-600';
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec gradient solaire */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              ☀️ EXPERT SOLAIRE - DIMENSIONNEMENT POMPAGE
            </h2>
            <p className="text-yellow-100 mt-2">
              Calculs automatisés • Dimensionnement optimisé • Analyse économique complète
            </p>
          </div>
          <div className="flex space-x-2">
            <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
              ✅ Temps réel
            </div>
            <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
              🔄 Auto-calcul
            </div>
            <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
              💡 IA Optimisée
            </div>
          </div>
        </div>
      </div>

      {/* Navigation des sections */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'project', label: '📋 Projet', color: 'blue' },
          { id: 'hydraulic', label: '💧 Hydraulique', color: 'cyan' },
          { id: 'energy', label: '⚡ Énergie', color: 'yellow' },
          { id: 'results', label: '📊 Résultats', color: 'green' },
          { id: 'economics', label: '💰 Économie', color: 'purple' }
        ].map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeSection === section.id
                ? `bg-${section.color}-500 text-white shadow-lg`
                : `bg-${section.color}-100 text-${section.color}-700 hover:bg-${section.color}-200`
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Section Informations du Projet */}
      {activeSection === 'project' && (
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">📋 Informations du Projet</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Nom du projet</label>
              <input
                type="text"
                value={solarData.project_name}
                onChange={(e) => handleInputChange('project_name', e.target.value)}
                className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Région géographique</label>
              <select
                value={`${solarData.location_region}.${solarData.location_subregion}`}
                onChange={(e) => {
                  const [region, subregion] = e.target.value.split('.');
                  handleInputChange('location_region', region);
                  handleInputChange('location_subregion', subregion);
                }}
                className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                {availableRegions.map(region => (
                  <option key={`${region.region}.${region.subregion}`} value={`${region.region}.${region.subregion}`}>
                    {region.name} ({region.irradiation_annual} kWh/m²/j)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Type d'installation</label>
              <select
                value={solarData.installation_type}
                onChange={(e) => handleInputChange('installation_type', e.target.value)}
                className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="submersible">🔽 Pompe Submersible</option>
                <option value="surface">🔼 Pompe de Surface</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Tension système (V)</label>
              <select
                value={solarData.system_voltage}
                onChange={(e) => handleInputChange('system_voltage', parseInt(e.target.value))}
                className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value={12}>12V DC</option>
                <option value={24}>24V DC</option>
                <option value={48}>48V DC</option>
                <option value={96}>96V DC</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Autonomie souhaitée (jours)</label>
              <input
                type="number"
                value={solarData.autonomy_days}
                onChange={(e) => handleInputChange('autonomy_days', parseInt(e.target.value))}
                className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                min="1" max="7"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Budget maximum (€)</label>
              <input
                type="number"
                value={solarData.max_budget || ''}
                onChange={(e) => handleInputChange('max_budget', e.target.value ? parseFloat(e.target.value) : null)}
                className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Optionnel"
              />
            </div>
          </div>
        </div>
      )}

      {/* Section Paramètres Hydrauliques */}
      {activeSection === 'hydraulic' && (
        <div className="bg-cyan-50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-cyan-900 mb-4">💧 Paramètres Hydrauliques</h3>
          
          {/* Paramètres d'eau et débit */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-cyan-800 mb-3">💧 Besoins en Eau & Fonctionnement</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border-l-4 border-cyan-500">
                <label className="block text-sm font-medium text-cyan-700 mb-2">Volume quotidien (m³/jour)</label>
                <input
                  type="number"
                  step="0.1"
                  value={solarData.daily_water_need}
                  onChange={(e) => handleInputChange('daily_water_need', parseFloat(e.target.value))}
                  className="w-full p-3 border-2 border-cyan-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 text-lg font-semibold"
                />
                <p className="text-xs text-cyan-600 mt-1">Volume d'eau nécessaire par jour</p>
              </div>

              <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                <label className="block text-sm font-medium text-blue-700 mb-2">Heures fonctionnement/jour</label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="12"
                  value={solarData.operating_hours}
                  onChange={(e) => handleInputChange('operating_hours', parseFloat(e.target.value))}
                  className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-lg font-semibold"
                />
                <p className="text-xs text-blue-600 mt-1">Heures de pompage par jour</p>
              </div>

              <div className="bg-gradient-to-r from-green-100 to-green-200 p-4 rounded-lg border-l-4 border-green-600">
                <label className="block text-sm font-medium text-green-800 mb-2">Débit calculé (m³/h)</label>
                <input
                  type="number"
                  step="0.1"
                  value={solarData.flow_rate}
                  readOnly
                  className="w-full p-3 border-2 border-green-300 rounded-lg bg-green-50 text-lg font-bold text-green-800 cursor-not-allowed"
                />
                <p className="text-xs text-green-700 mt-1">Calculé automatiquement</p>
              </div>

              <div className="bg-white p-4 rounded-lg border-l-4 border-orange-500">
                <label className="block text-sm font-medium text-orange-700 mb-2">Variation saisonnière</label>
                <input
                  type="number"
                  step="0.1"
                  value={solarData.seasonal_variation}
                  onChange={(e) => handleInputChange('seasonal_variation', parseFloat(e.target.value))}
                  className="w-full p-3 border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  min="1.0" max="2.0"
                />
                <p className="text-xs text-orange-600 mt-1">Coeff. été (1.0 = constant)</p>
              </div>
            </div>
          </div>

          {/* Calcul HMT restructuré */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-blue-800 mb-3">📏 Calcul HMT (Hauteur Manométrique Totale)</h4>
            
            {/* Première ligne : Composants de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                <label className="block text-sm font-medium text-blue-700 mb-2">Niveau dynamique (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={solarData.dynamic_level}
                  onChange={(e) => handleInputChange('dynamic_level', parseFloat(e.target.value))}
                  className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-lg font-semibold"
                />
                <p className="text-xs text-blue-600 mt-1">Profondeur niveau d'eau</p>
              </div>

              <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                <label className="block text-sm font-medium text-blue-700 mb-2">Hauteur château (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={solarData.tank_height}
                  onChange={(e) => handleInputChange('tank_height', parseFloat(e.target.value))}
                  className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-lg font-semibold"
                />
                <p className="text-xs text-blue-600 mt-1">Hauteur du réservoir/château</p>
              </div>

              <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-4 rounded-lg border-l-4 border-purple-600">
                <label className="block text-sm font-medium text-purple-800 mb-2">Hauteur géométrique (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={solarData.static_head}
                  readOnly
                  className="w-full p-3 border-2 border-purple-300 rounded-lg bg-purple-50 text-lg font-bold text-purple-800 cursor-not-allowed"
                />
                <p className="text-xs text-purple-700 mt-1">Niveau + Château (auto)</p>
              </div>

              <div className="bg-white p-4 rounded-lg border-l-4 border-red-500">
                <label className="block text-sm font-medium text-red-700 mb-2">Pertes de charge (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={solarData.dynamic_losses}
                  onChange={(e) => handleInputChange('dynamic_losses', parseFloat(e.target.value))}
                  className="w-full p-3 border-2 border-red-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 text-lg font-semibold"
                />
                <p className="text-xs text-red-600 mt-1">Pertes dans tuyauteries</p>
              </div>
            </div>

            {/* Deuxième ligne : Calcul final */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border-l-4 border-yellow-500">
                <label className="block text-sm font-medium text-yellow-700 mb-2">Pression utile (Bar)</label>
                <input
                  type="number"
                  step="0.1"
                  value={solarData.useful_pressure_head}
                  onChange={(e) => handleInputChange('useful_pressure_head', parseFloat(e.target.value))}
                  className="w-full p-3 border-2 border-yellow-200 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 text-lg font-semibold"
                />
                <p className="text-xs text-yellow-600 mt-1">Pression résiduelle requise en sortie</p>
              </div>

              <div className="bg-gradient-to-r from-green-200 to-green-300 p-4 rounded-lg border-l-4 border-green-700 shadow-lg">
                <label className="block text-sm font-medium text-green-900 mb-2">🎯 HMT TOTALE (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={solarData.total_head}
                  readOnly
                  className="w-full p-3 border-2 border-green-400 rounded-lg bg-green-100 text-2xl font-bold text-green-900 cursor-not-allowed text-center"
                />
                <p className="text-xs text-green-800 mt-1 text-center">Calculé automatiquement</p>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg border-l-4 border-gray-500">
                <h5 className="text-sm font-medium text-gray-700 mb-2">📊 Répartition HMT</h5>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Géométrique:</span>
                    <span className="font-semibold">{solarData.static_head.toFixed(1)}m ({((solarData.static_head / solarData.total_head) * 100).toFixed(0)}%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pertes charge:</span>
                    <span className="font-semibold">{solarData.dynamic_losses.toFixed(1)}m ({((solarData.dynamic_losses / solarData.total_head) * 100).toFixed(0)}%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pression utile:</span>
                    <span className="font-semibold">{solarData.useful_pressure_head.toFixed(1)}m ({((solarData.useful_pressure_head / solarData.total_head) * 100).toFixed(0)}%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Paramètres solaires et DN automatique */}
          <div>
            <h4 className="text-lg font-semibold text-yellow-800 mb-3">☀️ Paramètres Solaires & DN Conduite</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-lg border-l-4 border-yellow-500">
                <label className="block text-sm font-medium text-yellow-800 mb-2">Puissance crête panneau (Wc)</label>
                <select
                  value={solarData.panel_peak_power}
                  onChange={(e) => handleInputChange('panel_peak_power', parseInt(e.target.value))}
                  className="w-full p-3 border-2 border-yellow-300 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 text-lg font-semibold"
                >
                  <option value={100}>100 Wc - Petit panneau</option>
                  <option value={200}>200 Wc - Panneau compact</option>
                  <option value={270}>270 Wc - Polycristallin standard</option>
                  <option value={320}>320 Wc - Polycristallin amélioré</option>
                  <option value={400}>400 Wc - Monocristallin standard</option>
                  <option value={550}>550 Wc - Monocristallin haute performance</option>
                  <option value={600}>600 Wc - Panneau haute puissance</option>
                </select>
                <p className="text-xs text-yellow-700 mt-1">Puissance unitaire des panneaux</p>
              </div>

              <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-4 rounded-lg border-l-4 border-blue-600">
                <label className="block text-sm font-medium text-blue-800 mb-2">DN Conduite (calculé temps réel)</label>
                <input
                  type="text"
                  value={`DN ${(() => {
                    // CALCUL DN VRAIMENT DYNAMIQUE basé sur débit actuel
                    const flowM3h = solarData.flow_rate || 1;
                    const flowM3s = flowM3h / 3600; // conversion en m³/s
                    const velocity = 2.0; // vitesse optimale 2 m/s
                    const diameterM = Math.sqrt((4 * flowM3s) / (Math.PI * velocity)); // diamètre en mètres
                    const diameterMM = diameterM * 1000; // conversion en mm
                    
                    // Normalisation vers DN standard
                    const standardDNs = [20, 25, 32, 40, 50, 63, 80, 100, 125, 150, 200, 250, 300];
                    const calculatedDN = standardDNs.find(dn => dn >= diameterMM) || standardDNs[standardDNs.length - 1];
                    
                    return calculatedDN;
                  })()}`}
                  readOnly
                  className="w-full p-3 border-2 border-blue-300 rounded-lg bg-blue-50 text-lg font-bold text-blue-800 cursor-not-allowed text-center"
                />
                <p className="text-xs text-blue-700 mt-1">
                  Basé sur débit {solarData.flow_rate.toFixed(2)} m³/h (v=2m/s)
                </p>
              </div>
            </div>

            {/* Informations techniques sur la conduite */}
            <div className="mt-4 bg-gray-50 p-4 rounded-lg border">
              <h5 className="text-sm font-semibold text-gray-700 mb-2">📋 Spécifications Techniques Conduite</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                {(() => {
                  const flowM3h = solarData.flow_rate || 1;
                  const flowM3s = flowM3h / 3600;
                  const velocity = 2.0;
                  const diameterM = Math.sqrt((4 * flowM3s) / (Math.PI * velocity));
                  const diameterMM = diameterM * 1000;
                  const standardDNs = [20, 25, 32, 40, 50, 63, 80, 100, 125, 150, 200, 250, 300];
                  const calculatedDN = standardDNs.find(dn => dn >= diameterMM) || standardDNs[standardDNs.length - 1];
                  const actualVelocity = flowM3s / (Math.PI * Math.pow(calculatedDN/2000, 2));
                  
                  return (
                    <>
                      <div className="text-center">
                        <div className="font-semibold text-blue-600">Vitesse réelle</div>
                        <div>{actualVelocity.toFixed(2)} m/s</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-green-600">Matériau</div>
                        <div>{calculatedDN <= 63 ? 'PEHD' : 'PVC-U'}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-orange-600">Pression</div>
                        <div>PN {calculatedDN <= 100 ? '16' : '10'} bar</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-purple-600">Norme</div>
                        <div>ISO 4427</div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section Paramètres Énergétiques */}
      {activeSection === 'energy' && (
        <div className="bg-yellow-50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-yellow-900 mb-4">⚡ Paramètres Énergétiques & Environnementaux</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Paramètres économiques */}
            <div className="bg-white p-4 rounded-lg border-t-4 border-green-500">
              <h4 className="font-semibold text-green-700 mb-3">💰 Économique</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coût électricité (€/kWh)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={solarData.electricity_cost}
                    onChange={(e) => handleInputChange('electricity_cost', parseFloat(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durée projet (années)</label>
                  <input
                    type="number"
                    value={solarData.project_lifetime}
                    onChange={(e) => handleInputChange('project_lifetime', parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-200"
                    min="10" max="30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance annuelle (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={solarData.maintenance_cost_annual * 100}
                    onChange={(e) => handleInputChange('maintenance_cost_annual', parseFloat(e.target.value) / 100)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-200"
                  />
                </div>
              </div>
            </div>

            {/* Paramètres environnementaux */}
            <div className="bg-white p-4 rounded-lg border-t-4 border-orange-500">
              <h4 className="font-semibold text-orange-700 mb-3">🌤️ Environnemental</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Température ambiante (°C)</label>
                  <input
                    type="number"
                    value={solarData.ambient_temperature_avg}
                    onChange={(e) => handleInputChange('ambient_temperature_avg', parseFloat(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facteur poussière (0.9-1.0)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.8" max="1.0"
                    value={solarData.dust_factor}
                    onChange={(e) => handleInputChange('dust_factor', parseFloat(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facteur ombrage (0.8-1.0)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.8" max="1.0"
                    value={solarData.shading_factor}
                    onChange={(e) => handleInputChange('shading_factor', parseFloat(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-200"
                  />
                </div>
              </div>
            </div>

            {/* Irradiation en temps réel */}
            <div className="bg-white p-4 rounded-lg border-t-4 border-red-500">
              <h4 className="font-semibold text-red-700 mb-3">☀️ Irradiation Locale</h4>
              {results && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Annuelle:</span>
                    <span className={`font-bold ${getSolarRadiationColor(results.solar_irradiation.annual)}`}>
                      {results.solar_irradiation.annual.toFixed(1)} kWh/m²/j
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Été (max):</span>
                    <span className={`font-bold ${getSolarRadiationColor(results.solar_irradiation.peak_month)}`}>
                      {results.solar_irradiation.peak_month.toFixed(1)} kWh/m²/j
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Hiver (min):</span>
                    <span className={`font-bold ${getSolarRadiationColor(results.solar_irradiation.min_month)}`}>
                      {results.solar_irradiation.min_month.toFixed(1)} kWh/m²/j
                    </span>
                  </div>
                  <div className="mt-3 p-2 bg-yellow-100 rounded">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Efficacité système:</span>
                      <span className="font-bold text-yellow-700">
                        {(results.system_efficiency * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Section Résultats */}
      {activeSection === 'results' && results && (
        <div className="space-y-6">
          <div className="bg-green-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-green-900 mb-4">📊 Installation Optimale - Résultats Automatiques</h3>
            
            {/* Alerte de chargement */}
            {loading && (
              <div className="bg-blue-100 border border-blue-300 text-blue-700 px-4 py-3 rounded-lg mb-4">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
                  Calcul en cours... Optimisation du système
                </div>
              </div>
            )}

            {/* Alertes critiques */}
            {results.critical_alerts && results.critical_alerts.length > 0 && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4">
                <h4 className="font-bold">🚨 Alertes Critiques:</h4>
                <ul className="list-disc ml-5">
                  {results.critical_alerts.map((alert, idx) => (
                    <li key={idx}>{alert}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Configuration du champ photovoltaïque */}
            <div className="mb-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-6 border-l-4 border-yellow-500">
              <h4 className="text-xl font-bold text-yellow-800 mb-4">☀️ Configuration Champ Photovoltaïque Optimal</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Puissance requise - CALCULS DYNAMIQUES RÉELS */}
                <div className="bg-white p-4 rounded-lg shadow-md border-t-2 border-red-500">
                  <h5 className="font-semibold text-red-700 mb-2">⚡ Puissance Requise</h5>
                  <div className="space-y-2 text-sm">
                    {(() => {
                      // CALCULS DYNAMIQUES RÉELS basés sur les données saisies
                      const hydraulicPowerKW = (solarData.flow_rate * solarData.total_head * 1000 * 9.81) / 3600 / 1000; // kW
                      const pumpEfficiency = 0.75; // 75% rendement pompe
                      const electricalPowerKW = hydraulicPowerKW / pumpEfficiency; // kW
                      const systemLosses = 0.8; // 80% efficacité système
                      const peakPowerKW = electricalPowerKW / systemLosses; // kWc nécessaire
                      
                      return (
                        <>
                          <div className="flex justify-between">
                            <span>P. hydraulique:</span>
                            <span className="font-bold text-blue-600">
                              {hydraulicPowerKW.toFixed(2)} kW
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Rendement pompe:</span>
                            <span className="font-bold">{(pumpEfficiency * 100).toFixed(0)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>P. électrique:</span>
                            <span className="font-bold text-red-600">
                              {electricalPowerKW.toFixed(2)} kW
                            </span>
                          </div>
                          <div className="bg-red-50 p-2 rounded mt-2">
                            <div className="text-xs text-red-700 text-center">
                              P. crête nécessaire: {peakPowerKW.toFixed(2)} kWc
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Dimensionnement automatique - CALCULS DYNAMIQUES RÉELS */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h5 className="font-semibold text-yellow-700 mb-2">📐 Dimensionnement Auto</h5>
                  <div className="space-y-2 text-sm">
                    {(() => {
                      const hydraulicPowerKW = (solarData.flow_rate * solarData.total_head * 1000 * 9.81) / 3600 / 1000;
                      const electricalPowerKW = hydraulicPowerKW / 0.75;
                      const peakPowerW = (electricalPowerKW / 0.8) * 1000; // Watts
                      const nbPanels = Math.ceil(peakPowerW / solarData.panel_peak_power);
                      const totalPowerW = nbPanels * solarData.panel_peak_power;
                      
                      return (
                        <>
                          <div className="flex justify-between">
                            <span>Puissance requise:</span>
                            <span className="font-bold text-red-600">{peakPowerW.toFixed(0)}W</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Nombre panneaux:</span>
                            <span className="font-bold text-yellow-800">{nbPanels}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Puissance unitaire:</span>
                            <span className="font-bold">{solarData.panel_peak_power} Wc</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Puissance totale:</span>
                            <span className="font-bold text-green-600">{totalPowerW} Wc</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Surface requise:</span>
                            <span className="font-bold">{(nbPanels * 2).toFixed(1)} m²</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Configuration série/parallèle - CALCULS VRAIMENT DYNAMIQUES */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h5 className="font-semibold text-blue-700 mb-2">🔗 Config. Série/Parallèle</h5>
                  <div className="space-y-2 text-sm">
                    {(() => {
                      // CALCULS VRAIMENT DYNAMIQUES ET CORRECTS
                      const hydraulicPowerKW = (solarData.flow_rate * solarData.total_head * 1000 * 9.81) / 3600 / 1000;
                      const electricalPowerKW = hydraulicPowerKW / 0.75;
                      const peakPowerW = (electricalPowerKW / 0.8) * 1000;
                      const totalPanels = Math.ceil(peakPowerW / solarData.panel_peak_power);
                      
                      // CORRECTION LOGIQUE SÉRIE/PARALLÈLE
                      const systemVoltage = solarData.system_voltage; // 12V, 24V, 48V ou 96V
                      
                      // Tension panneau selon puissance (logique réelle)
                      let panelVoltage;
                      if (solarData.panel_peak_power <= 200) panelVoltage = 12;
                      else if (solarData.panel_peak_power <= 400) panelVoltage = 24; 
                      else panelVoltage = 48;
                      
                      // CALCUL CORRECT panneaux en série
                      const panelsInSeries = Math.max(1, Math.ceil(systemVoltage / panelVoltage));
                      
                      // CALCUL CORRECT strings en parallèle  
                      const strings = Math.max(1, Math.ceil(totalPanels / panelsInSeries));
                      
                      const stringVoltage = panelsInSeries * panelVoltage;
                      
                      return (
                        <>
                          <div className="flex justify-between">
                            <span>Panneaux total:</span>
                            <span className="font-bold text-gray-600">{totalPanels}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tension panneau:</span>
                            <span className="font-bold text-green-600">{panelVoltage}V</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Panneaux/série:</span>
                            <span className="font-bold text-blue-600">{panelsInSeries}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Strings parallèle:</span>
                            <span className="font-bold text-blue-600">{strings}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Configuration:</span>
                            <span className="font-bold text-purple-600">{panelsInSeries}S{strings}P</span>
                          </div>
                          <div className="bg-blue-50 p-2 rounded mt-2">
                            <div className="text-xs text-blue-700 text-center">
                              Tension string: {stringVoltage}V → Système {systemVoltage}V
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Estimation coût - CALCULS DYNAMIQUES RÉELS */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h5 className="font-semibold text-green-700 mb-2">💰 Estimation Coût</h5>
                  <div className="space-y-2 text-sm">
                    {(() => {
                      const hydraulicPowerKW = (solarData.flow_rate * solarData.total_head * 1000 * 9.81) / 3600 / 1000;
                      const electricalPowerKW = hydraulicPowerKW / 0.75;
                      const peakPowerW = (electricalPowerKW / 0.8) * 1000;
                      const nbPanels = Math.ceil(peakPowerW / solarData.panel_peak_power);
                      const pricePerWatt = solarData.panel_peak_power >= 400 ? 0.7 : 0.6; // €/Wc
                      const unitPrice = solarData.panel_peak_power * pricePerWatt;
                      const totalCost = nbPanels * unitPrice;
                      
                      return (
                        <>
                          <div className="flex justify-between">
                            <span>Prix unitaire:</span>
                            <span className="font-bold">{formatCurrency(unitPrice)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Quantité:</span>
                            <span className="font-bold">{nbPanels} panneaux</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Coût total:</span>
                            <span className="font-bold text-green-600">{formatCurrency(totalCost)}</span>
                          </div>
                          <div className="bg-green-50 p-2 rounded mt-2">
                            <div className="text-xs text-green-700 text-center">
                              {(totalCost / (nbPanels * solarData.panel_peak_power) * 1000).toFixed(2)} €/kWc
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* Équipements du système - VALEURS ENTIÈREMENT DYNAMIQUES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pompe solaire - SPÉCIFICATIONS VRAIMENT DYNAMIQUES */}
              <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500 shadow-md">
                <h4 className="font-semibold text-blue-700 mb-2 flex items-center">
                  💧 Pompe Solaire Recommandée
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="font-medium text-lg text-blue-800">
                    Pompe {solarData.installation_type === 'submersible' ? 'Submersible' : 'de Surface'}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(() => {
                      // CALCULS VRAIMENT DYNAMIQUES pour la pompe
                      const hydraulicPowerKW = (solarData.flow_rate * solarData.total_head * 1000 * 9.81) / 3600 / 1000;
                      const pumpEfficiencyEstimated = solarData.flow_rate < 2 ? 0.65 : 
                                                     solarData.flow_rate < 5 ? 0.75 :
                                                     solarData.flow_rate < 10 ? 0.80 : 0.82;
                      const electricalPowerKW = hydraulicPowerKW / pumpEfficiencyEstimated;
                      const nominalPowerW = electricalPowerKW * 1000 * 1.15; // marge sécurité 15%
                      
                      return (
                        <>
                          <div>
                            <span className="text-gray-600">Puissance nominale:</span>
                            <span className="font-semibold ml-1 text-red-600">{nominalPowerW.toFixed(0)}W</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Efficacité estimée:</span>
                            <span className="font-semibold ml-1 text-red-600">{(pumpEfficiencyEstimated * 100).toFixed(0)}%</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Type installation:</span>
                            <span className="font-semibold ml-1">{solarData.installation_type === 'submersible' ? 'Immergée' : 'Surface'}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Débit nominal:</span>
                            <span className="font-semibold ml-1 text-red-600">{solarData.flow_rate.toFixed(1)} m³/h</span>
                          </div>
                          <div>
                            <span className="text-gray-600">HMT requise:</span>
                            <span className="font-semibold ml-1 text-red-600">{solarData.total_head.toFixed(0)} m</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Tension d'alim.:</span>
                            <span className="font-semibold ml-1">{solarData.system_voltage}V DC</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  <div className="bg-blue-50 p-2 rounded mt-2">
                    <div className="text-xs text-blue-700">
                      <strong>Recommandation:</strong> Pompe DC avec contrôleur MPPT intégré ou externe
                    </div>
                  </div>
                </div>
              </div>

              {/* Système de stockage - DYNAMIQUE */}
              <div className="bg-white p-4 rounded-lg border-l-4 border-purple-500 shadow-md">
                <h4 className="font-semibold text-purple-700 mb-2">🔋 Système de Stockage</h4>
                <div className="space-y-2 text-sm">
                  <div className="font-medium text-lg text-purple-800">
                    Batteries {solarData.autonomy_days >= 3 ? 'Lithium LiFePO4' : 'Gel/AGM'}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(() => {
                      const hydraulicPowerKW = (solarData.flow_rate * solarData.total_head * 1000 * 9.81) / 3600 / 1000;
                      const electricalPowerKW = hydraulicPowerKW / 0.75;
                      const dailyEnergyNeed = electricalPowerKW * solarData.operating_hours; // kWh/jour
                      const autonomyEnergyKWh = dailyEnergyNeed * solarData.autonomy_days;
                      const systemVoltage = solarData.system_voltage;
                      const batteryCapacityAh = (autonomyEnergyKWh * 1000) / systemVoltage / 0.8; // DOD 80%
                      const nbBatteries = Math.ceil(batteryCapacityAh / 100); // batteries 100Ah standard
                      
                      const seriesBatteries = Math.ceil(systemVoltage / 12); // batteries 12V standard
                      const parallelBatteries = Math.ceil(nbBatteries / seriesBatteries);
                      const totalBatteries = seriesBatteries * parallelBatteries;
                      
                      return (
                        <>
                          <div>
                            <span className="text-gray-600">Configuration:</span>
                            <span className="font-semibold ml-1">{seriesBatteries}S{parallelBatteries}P</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Nombre batteries:</span>
                            <span className="font-semibold ml-1">{totalBatteries}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Capacité totale:</span>
                            <span className="font-semibold ml-1">{(totalBatteries * 100).toFixed(0)}Ah @ {systemVoltage}V</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Énergie stockée:</span>
                            <span className="font-semibold ml-1">{(totalBatteries * 100 * systemVoltage / 1000).toFixed(1)} kWh</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Autonomie:</span>
                            <span className="font-semibold ml-1">{solarData.autonomy_days} jour{solarData.autonomy_days > 1 ? 's' : ''}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Cycles de vie:</span>
                            <span className="font-semibold ml-1">{solarData.autonomy_days >= 3 ? '6000' : '1500'}</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  <div className="bg-purple-50 p-2 rounded mt-2">
                    <div className="text-xs text-purple-700">
                      <strong>Recommandation:</strong> {solarData.autonomy_days >= 3 ? 
                      'Batteries Lithium pour autonomie élevée et performance optimales' : 
                      'Batteries Gel pour rapport qualité/prix avec maintenance réduite'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Régulateur MPPT - DYNAMIQUE */}
              <div className="bg-white p-4 rounded-lg border-l-4 border-green-500 shadow-md">
                <h4 className="font-semibold text-green-700 mb-2">⚡ Régulateur MPPT</h4>
                <div className="space-y-2 text-sm">
                  <div className="font-medium text-lg text-green-800">Contrôleur MPPT High Efficiency</div>
                  <div className="grid grid-cols-2 gap-2">
                    {(() => {
                      const hydraulicPowerKW = (solarData.flow_rate * solarData.total_head * 1000 * 9.81) / 3600 / 1000;
                      const electricalPowerKW = hydraulicPowerKW / 0.75;
                      const peakPowerW = (electricalPowerKW / 0.8) * 1000;
                      const totalPanels = Math.ceil(peakPowerW / solarData.panel_peak_power);
                      
                      let panelVoltage;
                      if (solarData.panel_peak_power <= 200) panelVoltage = 12;
                      else if (solarData.panel_peak_power <= 400) panelVoltage = 24; 
                      else panelVoltage = 48;
                      
                      const panelsInSeries = Math.max(1, Math.ceil(solarData.system_voltage / panelVoltage));
                      const strings = Math.max(1, Math.ceil(totalPanels / panelsInSeries));
                      
                      const currentPerPanel = solarData.panel_peak_power / panelVoltage;
                      const totalCurrent = strings * currentPerPanel * 1.25; // marge sécurité 25%
                      const maxPvVoltage = panelsInSeries * panelVoltage * 1.3; // marge froid
                      
                      return (
                        <>
                          <div>
                            <span className="text-gray-600">Courant max:</span>
                            <span className="font-semibold ml-1">{totalCurrent.toFixed(0)}A</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Tension PV max:</span>
                            <span className="font-semibold ml-1">{maxPvVoltage.toFixed(0)}V</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Efficacité:</span>
                            <span className="font-semibold ml-1">98%</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Tension batterie:</span>
                            <span className="font-semibold ml-1">{solarData.system_voltage}V nominal</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Protection:</span>
                            <span className="font-semibold ml-1">IP65 minimum</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Monitoring:</span>
                            <span className="font-semibold ml-1">{totalCurrent >= 30 ? 'Bluetooth/WiFi' : 'LCD/LED'}</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  <div className="bg-green-50 p-2 rounded mt-2">
                    <div className="text-xs text-green-700">
                      <strong>Recommandation:</strong> MPPT avec tracking intelligent et protection contre surtensions
                    </div>
                  </div>
                </div>
              </div>

              {/* Résumé système - ENTIÈREMENT DYNAMIQUE */}
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-4 rounded-lg border-l-4 border-gray-600 shadow-md">
                <h4 className="font-semibold text-gray-700 mb-2">📋 Spécifications Système</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Architecture:</span>
                    <span className="font-semibold">{solarData.system_voltage}V DC - {solarData.installation_type === 'submersible' ? 'Immergée' : 'Surface'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Production quotidienne:</span>
                    <span className="font-semibold">{solarData.daily_water_need} m³/jour</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Heures fonctionnement:</span>
                    <span className="font-semibold">{solarData.operating_hours}h/jour</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Efficacité globale:</span>
                    <span className="font-semibold">60-80%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Protection requise:</span>
                    <span className="font-semibold">IP65, Parafoudre</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Certification:</span>
                    <span className="font-semibold">CE, IEC 61215</span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded mt-2">
                    {(() => {
                      const hydraulicPowerKW = (solarData.flow_rate * solarData.total_head * 1000 * 9.81) / 3600 / 1000;
                      const electricalPowerKW = hydraulicPowerKW / 0.75;
                      const peakPowerW = (electricalPowerKW / 0.8) * 1000;
                      const nbPanels = Math.ceil(peakPowerW / solarData.panel_peak_power);
                      const pricePerWatt = solarData.panel_peak_power >= 400 ? 0.7 : 0.6;
                      const panelsCost = nbPanels * solarData.panel_peak_power * pricePerWatt;
                      const pumpCost = Math.max(800, electricalPowerKW * 1200); // €/kW pompe
                      const batteryCapacityKWh = solarData.autonomy_days * electricalPowerKW * solarData.operating_hours;
                      const batteryCost = batteryCapacityKWh * 600; // €/kWh batteries
                      const mpptCost = Math.max(150, peakPowerW * 0.15); // €/W MPPT
                      const totalCost = panelsCost + pumpCost + batteryCost + mpptCost + 1500; // installation
                      
                      return (
                        <div className="font-bold text-blue-600 text-center">
                          INVESTISSEMENT ESTIMÉ: {formatCurrency(totalCost)}
                          <div className="text-xs text-gray-600 font-normal mt-1">
                            Installation et mise en service comprises
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* Graphique de performance */}
            <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
              <h4 className="font-semibold text-gray-800 mb-3">📊 Performance Mensuelle du Système</h4>
              <canvas ref={chartRef} style={{maxHeight: '400px'}}></canvas>
            </div>

            {/* Capacité de pompage mensuelle */}
            <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
              <h4 className="font-semibold text-gray-800 mb-3">💧 Capacité de Pompage Mensuelle</h4>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-sm">
                {['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'].map((month, idx) => (
                  <div key={month} className="bg-blue-50 p-2 rounded text-center border">
                    <div className="font-medium text-blue-800">{month}</div>
                    <div className="text-blue-600">
                      {results.monthly_performance.water_production[idx].toFixed(1)} m³/j
                    </div>
                    <div className="text-xs text-gray-600">
                      {results.monthly_performance.pump_hours[idx].toFixed(1)}h
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section Analyse Économique */}
      {activeSection === 'economics' && results && (
        <div className="bg-purple-50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-4">💰 Analyse Économique Complète</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Coûts du système */}
            <div className="bg-white p-6 rounded-lg border-t-4 border-red-500">
              <h4 className="font-semibold text-red-700 mb-3">💸 Coûts d'Investissement</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Pompe:</span>
                  <span className="font-medium">{formatCurrency(results.dimensioning.recommended_pump.cost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Panneaux:</span>
                  <span className="font-medium">{formatCurrency(results.dimensioning.solar_panels.cost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Batteries:</span>
                  <span className="font-medium">{formatCurrency(results.dimensioning.batteries.cost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Régulateur:</span>
                  <span className="font-medium">{formatCurrency(results.dimensioning.mppt_controller.cost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Installation:</span>
                  <span className="font-medium">{formatCurrency(1500)}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-bold text-red-700">
                  <span>TOTAL:</span>
                  <span>{formatCurrency(results.dimensioning.economic_analysis.total_system_cost)}</span>
                </div>
              </div>
            </div>

            {/* Économies annuelles */}
            <div className="bg-white p-6 rounded-lg border-t-4 border-green-500">
              <h4 className="font-semibold text-green-700 mb-3">💰 Économies Annuelles</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Économies brutes:</span>
                  <span className="font-medium text-green-600">{formatCurrency(results.dimensioning.economic_analysis.annual_savings)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Maintenance:</span>
                  <span className="font-medium text-red-600">-{formatCurrency(results.dimensioning.economic_analysis.annual_maintenance)}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-bold text-green-700">
                  <span>Économies nettes:</span>
                  <span>{formatCurrency(results.dimensioning.economic_analysis.net_annual_savings)}</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-green-100 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-800">
                    {results.dimensioning.economic_analysis.payback_period.toFixed(1)} ans
                  </div>
                  <div className="text-sm text-green-600">Période de retour</div>
                </div>
              </div>
            </div>

            {/* ROI et rentabilité */}
            <div className="bg-white p-6 rounded-lg border-t-4 border-blue-500">
              <h4 className="font-semibold text-blue-700 mb-3">📈 Rentabilité</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Durée projet:</span>
                  <span className="font-medium">{results.dimensioning.economic_analysis.project_lifetime} ans</span>
                </div>
                <div className="flex justify-between">
                  <span>Économies totales:</span>
                  <span className="font-medium text-blue-600">{formatCurrency(results.dimensioning.economic_analysis.total_lifetime_savings)}</span>
                </div>
                <div className="flex justify-between">
                  <span>ROI:</span>
                  <span className="font-medium text-blue-600">{results.dimensioning.economic_analysis.roi_percentage.toFixed(1)}%</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-800">
                      {formatCurrency(results.dimensioning.economic_analysis.total_lifetime_savings - results.dimensioning.economic_analysis.total_system_cost)}
                    </div>
                    <div className="text-sm text-blue-600">Bénéfice net sur {results.dimensioning.economic_analysis.project_lifetime} ans</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommandations économiques */}
          {results.dimensioning.optimization_suggestions && results.dimensioning.optimization_suggestions.length > 0 && (
            <div className="mt-6 bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-lg">
              <h4 className="font-bold">💡 Suggestions d'Optimisation:</h4>
              <ul className="list-disc ml-5 mt-2">
                {results.dimensioning.optimization_suggestions.map((suggestion, idx) => (
                  <li key={idx}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommandations techniques */}
          {results.dimensioning.technical_recommendations && results.dimensioning.technical_recommendations.length > 0 && (
            <div className="mt-4 bg-blue-100 border border-blue-300 text-blue-800 px-4 py-3 rounded-lg">
              <h4 className="font-bold">🔧 Recommandations Techniques:</h4>
              <ul className="list-disc ml-5 mt-2">
                {results.dimensioning.technical_recommendations.map((recommendation, idx) => (
                  <li key={idx}>{recommendation}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Avertissements */}
      {results && results.warnings && results.warnings.length > 0 && (
        <div className="bg-orange-100 border border-orange-300 text-orange-800 px-4 py-3 rounded-lg">
          <h4 className="font-bold">⚠️ Avertissements:</h4>
          <ul className="list-disc ml-5">
            {results.warnings.map((warning, idx) => (
              <li key={idx}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Component pour Onglet COMPATIBILITÉ CHIMIQUE - Interface Liste Déroulante
const ChemicalCompatibility = () => {
  const [selectedFluid, setSelectedFluid] = useState('');

  // Base de données exhaustive de compatibilité chimique industrielle
  const chemicalCompatibilityDatabase = {
    // FLUIDES AVEC COMPATIBILITÉS MATÉRIAUX
    "water": {
      name: "Eau",
      ph_range: "6.5-8.5",
      corrosiveness: "Faible",
      temperature_limits: "-10°C à +100°C",
      icon: "💧",
      compatibility: {
        "excellent": {
          materials: ["316L Stainless Steel", "PVC", "PEHD", "PP", "PTFE", "EPDM", "Viton", "Bronze Naval"],
          reasons: ["Résistance à la corrosion", "Inertie chimique", "Usage eau potable"]
        },
        "good": {
          materials: ["304 Stainless Steel", "Acier Carbone (avec revêtement)", "Fonte Ductile", "Laiton"],
          reasons: ["Résistance acceptable", "Nécessite traitement anticorrosion"]
        },
        "poor": {
          materials: ["Acier Carbone Nu", "Zinc", "Aluminium (eau de mer)"],
          reasons: ["Corrosion rapide", "Formation d'oxydes", "Durée de vie limitée"]
        },
        "incompatible": {
          materials: ["Magnésium", "Acier Galvanisé (long terme)"],
          reasons: ["Corrosion galvanique", "Dégradation rapide"]
        }
      }
    },
    
    "seawater": {
      name: "Eau de Mer",
      ph_range: "7.8-8.3",
      corrosiveness: "Très Élevée",
      temperature_limits: "-2°C à +40°C",
      salinity: "35 g/L",
      icon: "🌊",
      compatibility: {
        "excellent": {
          materials: ["Super Duplex 2507", "Inconel 625", "Hastelloy C-276", "Titane Grade 2", "Bronze Naval"],
          reasons: ["Résistance chlorures", "Pas de corrosion par piqûres", "Usage marin certifié"]
        },
        "good": {
          materials: ["316L Stainless Steel", "Duplex 2205", "Cupronickel 90/10"],
          reasons: ["Résistance acceptable", "Maintenance préventive requise"]
        },
        "poor": {
          materials: ["304 Stainless Steel", "Fonte", "Laiton Ordinaire"],
          reasons: ["Corrosion par piqûres", "Attaque chlorures", "Durée de vie réduite"]
        },
        "incompatible": {
          materials: ["Acier Carbone", "Zinc", "Aluminium", "PVC (>40°C)"],
          reasons: ["Corrosion massive", "Défaillance rapide", "Non adapté milieu marin"]
        }
      }
    },

    "palm_oil": {
      name: "Huile de Palme",
      ph_range: "Neutre",
      corrosiveness: "Faible",
      temperature_limits: "5°C à +60°C",
      saponification: "199 mg KOH/g",
      icon: "🌴",
      compatibility: {
        "excellent": {
          materials: ["316L Stainless Steel", "304 Stainless Steel", "PVC", "PP", "PTFE", "Viton", "EPDM"],
          reasons: ["Inertie aux huiles végétales", "Résistance température", "Usage alimentaire"]
        },
        "good": {
          materials: ["Acier Carbone Inoxydable", "Bronze", "Laiton Étamé"],
          reasons: ["Compatible huiles végétales", "Revêtement protecteur requis"]
        },
        "poor": {
          materials: ["Caoutchouc Naturel", "Zinc", "Cuivre Nu"],
          reasons: ["Gonflement", "Catalyse oxydation", "Saponification"]
        },
        "incompatible": {
          materials: ["Acier Galvanisé", "PVC Plastifié", "NBR (>50°C)"],
          reasons: ["Réaction chimique", "Migration plastifiants", "Dégradation température"]
        }
      }
    },

    "gasoline": {
      name: "Essence (Octane 95)",
      ph_range: "N/A",
      corrosiveness: "Modérée",
      temperature_limits: "-40°C à +50°C",
      volatility: "Très Élevée",
      icon: "⛽",
      compatibility: {
        "excellent": {
          materials: ["316L Stainless Steel", "Aluminum 5052", "PTFE", "Viton FKM", "Terne Plated Steel"],
          reasons: ["Résistance hydrocarbures", "Pas de gonflement", "Usage carburant certifié"]
        },
        "good": {
          materials: ["304 Stainless Steel", "Acier Carbone (revêtu)", "EPDM (spécial essence)"],
          reasons: ["Résistance acceptable", "Revêtement anti-corrosion nécessaire"]
        },
        "poor": {
          materials: ["PVC", "Polyéthylène Standard", "Caoutchouc Naturel"],
          reasons: ["Gonflement", "Perméabilité vapeurs", "Dégradation mécanique"]
        },
        "incompatible": {
          materials: ["Zinc", "Cuivre", "NBR Standard", "Plomb"],
          reasons: ["Formation de gommes", "Catalyse oxydation", "Pollution carburant"]
        }
      }
    },

    "diesel": {
      name: "Gazole (Diesel)",
      ph_range: "N/A", 
      corrosiveness: "Faible à Modérée",
      temperature_limits: "-20°C à +70°C",
      sulfur_content: "≤10 mg/kg (EN 590)",
      icon: "🚛",
      compatibility: {
        "excellent": {
          materials: ["Acier Carbone", "316L Stainless Steel", "Aluminum", "Viton FKM", "PTFE"],
          reasons: ["Usage standard diesel", "Résistance corrosion", "Étanchéité hydrocarbures"]
        },
        "good": {
          materials: ["304 Stainless Steel", "Fonte Ductile", "EPDM Diesel", "NBR Haute Performance"],
          reasons: ["Compatible diesel standard", "Résistance acceptable"]
        },
        "poor": {
          materials: ["PVC Standard", "Caoutchouc Naturel", "Polyéthylène"],
          reasons: ["Gonflement modéré", "Perméabilité", "Vieillissement accéléré"]
        },
        "incompatible": {
          materials: ["Zinc (contact direct)", "Cuivre (catalyseur)"],
          reasons: ["Formation de dépôts", "Catalyse d'oxydation", "Dégradation qualité"]
        }
      }
    },

    "hydraulic_oil": {
      name: "Huile Hydraulique ISO VG 46",
      ph_range: "N/A",
      corrosiveness: "Très Faible",
      temperature_limits: "-30°C à +80°C",
      additive_package: "Anti-usure, Anti-oxydant",
      icon: "🛢️",
      compatibility: {
        "excellent": {
          materials: ["Acier Carbone", "316L Stainless Steel", "Fonte", "NBR 90 Shore A", "Viton", "Polyuréthane"],
          reasons: ["Usage hydraulique standard", "Résistance pression", "Étanchéité parfaite"]
        },
        "good": {
          materials: ["304 Stainless Steel", "Bronze", "EPDM Hydraulique", "PTFE"],
          reasons: ["Compatible systèmes hydrauliques", "Durabilité prouvée"]
        },
        "poor": {
          materials: ["PVC Souple", "Caoutchouc Naturel", "SBR"],
          reasons: ["Gonflement", "Dégradation additifs", "Perte propriétés mécaniques"]
        },
        "incompatible": {
          materials: ["Zinc Direct", "PVC Plastifié"],
          reasons: ["Attaque additifs anti-usure", "Migration plastifiants"]
        }
      }
    },

    "ethanol": {
      name: "Éthanol (95%)",
      ph_range: "6.5-7.5",
      corrosiveness: "Modérée",
      temperature_limits: "-100°C à +60°C",
      concentration: "95% vol",
      icon: "🍾",
      compatibility: {
        "excellent": {
          materials: ["316L Stainless Steel", "PTFE", "EPDM Alcool", "Viton A", "PP"],
          reasons: ["Résistance alcools", "Inertie chimique", "Usage pharmaceutique"]
        },
        "good": {
          materials: ["304 Stainless Steel", "Acier Carbone Revêtu", "PVC (concentrations < 50%)"],
          reasons: ["Résistance acceptable", "Limitation concentration"]
        },
        "poor": {
          materials: ["Aluminum", "Zinc", "NBR Standard"],
          reasons: ["Corrosion intergranulaire", "Formation d'alcoolates", "Gonflement"]
        },
        "incompatible": {
          materials: ["Caoutchouc Naturel", "PVC Plastifié", "Acétals"],
          reasons: ["Dissolution", "Extraction plastifiants", "Fissuration contrainte"]
        }
      }
    },

    "methanol": {
      name: "Méthanol (99.5%)",
      ph_range: "6.0-7.0",
      corrosiveness: "Élevée",
      temperature_limits: "-100°C à +50°C",
      toxicity: "Très Toxique",
      icon: "🧪",
      compatibility: {
        "excellent": {
          materials: ["316L Stainless Steel", "Hastelloy C-276", "PTFE", "Viton A", "EPDM Spécial"],
          reasons: ["Résistance méthanol", "Pas de corrosion", "Étanchéité parfaite"]
        },
        "good": {
          materials: ["304 Stainless Steel", "Monel 400"],
          reasons: ["Résistance acceptable", "Inspection régulière requise"]
        },
        "poor": {
          materials: ["Aluminum", "PVC", "NBR"],
          reasons: ["Corrosion", "Gonflement", "Dégradation rapide"]
        },
        "incompatible": {
          materials: ["Caoutchouc Naturel", "Zinc", "Magnésium", "Plomb"],
          reasons: ["Dissolution complète", "Corrosion massive", "Toxicité renforcée"]
        }
      }
    },

    "glycerol": {
      name: "Glycérine (99%)",
      ph_range: "7.0",
      corrosiveness: "Très Faible",
      temperature_limits: "-10°C à +150°C",
      viscosity: "Très Élevée",
      icon: "🧴",
      compatibility: {
        "excellent": {
          materials: ["316L Stainless Steel", "304 Stainless Steel", "PVC", "PP", "PTFE", "EPDM", "Viton"],
          reasons: ["Inertie chimique", "Usage pharmaceutique", "Non corrosif"]
        },
        "good": {
          materials: ["Acier Carbone", "Fonte", "Bronze", "Laiton"],
          reasons: ["Compatible glycérine", "Pas d'attaque chimique"]
        },
        "poor": {
          materials: ["Caoutchouc Naturel (>100°C)", "NBR (température élevée)"],
          reasons: ["Ramollissement température", "Perte élasticité"]
        },
        "incompatible": {
          materials: [],
          reasons: ["Glycérine généralement compatible avec tous matériaux courants"]
        }
      }
    },

    "acid": {
      name: "Solution Acide (HCl 10%)",
      ph_range: "1.0-2.0",
      corrosiveness: "Très Élevée",
      temperature_limits: "0°C à +60°C",
      concentration: "10% HCl",
      icon: "⚠️",
      compatibility: {
        "excellent": {
          materials: ["Hastelloy C-276", "Inconel 625", "PTFE", "PVC-C", "PVDF", "EPDM Acide"],
          reasons: ["Résistance acides forts", "Pas d'attaque chimique", "Usage chimique certifié"]
        },
        "good": {
          materials: ["316L Stainless Steel (dilué)", "CPVC"],
          reasons: ["Résistance acides dilués", "Limitation concentration"]
        },
        "poor": {
          materials: ["304 Stainless Steel", "Aluminum", "Zinc"],
          reasons: ["Corrosion rapide", "Formation d'hydrogène", "Attaque intergranulaire"]
        },
        "incompatible": {
          materials: ["Acier Carbone", "Fonte", "Cuivre", "Laiton", "Caoutchouc Naturel"],
          reasons: ["Dissolution rapide", "Corrosion massive", "Réaction violente"]
        }
      }
    },

    // NOUVEAUX FLUIDES ALIMENTAIRES ET DOMESTIQUES
    "milk": {
      name: "Lait (3.5% MG)",
      ph_range: "6.6-6.8",
      corrosiveness: "Très Faible",
      temperature_limits: "2°C à +80°C",
      fat_content: "3.5% MG",
      icon: "🥛",
      compatibility: {
        "excellent": {
          materials: ["316L Stainless Steel", "PTFE", "EPDM Food Grade", "Silicone Alimentaire", "Verre Borosilicaté"],
          reasons: ["Usage alimentaire certifié", "Résistance nettoyage", "Inertie chimique totale"]
        },
        "good": {
          materials: ["304 Stainless Steel", "PP Food Grade", "PVC Alimentaire"],
          reasons: ["Compatible produits laitiers", "Nettoyage facile"]
        },
        "poor": {
          materials: ["Aluminum Non Traité", "PVC Standard"],
          reasons: ["Interaction avec acidité", "Absorption d'odeurs"]
        },
        "incompatible": {
          materials: ["Cuivre", "Laiton", "Caoutchouc Naturel", "Acier Galvanisé"],
          reasons: ["Contamination métallique", "Développement bactérien", "Altération goût"]
        }
      }
    },

    "honey": {
      name: "Miel (Naturel)",
      ph_range: "3.4-6.1",
      corrosiveness: "Faible (Acide)",
      temperature_limits: "10°C à +60°C",
      sugar_content: "82% sucres",
      icon: "🍯",
      compatibility: {
        "excellent": {
          materials: ["316L Stainless Steel", "Verre", "PTFE", "Silicone Food Grade", "Céramique Alimentaire"],
          reasons: ["Résistance sucres acides", "Pas d'interaction", "Facilité nettoyage"]
        },
        "good": {
          materials: ["304 Stainless Steel", "HDPE Food Grade", "PP"],
          reasons: ["Compatible alimentaire", "Résistance acceptable aux acides"]
        },
        "poor": {
          materials: ["Aluminum", "Étain", "PVC Standard"],
          reasons: ["Interaction acide", "Coloration possible", "Absorption"]
        },
        "incompatible": {
          materials: ["Fer", "Cuivre", "Plomb", "Caoutchouc Naturel"],
          reasons: ["Catalyse fermentation", "Contamination métallique", "Altération qualité"]
        }
      }
    },

    "wine": {
      name: "Vin Rouge (12° alcool)",
      ph_range: "3.3-3.7",
      corrosiveness: "Modérée (Acide + Alcool)",
      temperature_limits: "8°C à +25°C",
      alcohol_content: "12% vol",
      icon: "🍷",
      compatibility: {
        "excellent": {
          materials: ["316L Stainless Steel", "Verre", "PTFE", "EPDM Œnologique", "Chêne Traité"],
          reasons: ["Usage œnologique certifié", "Pas d'altération goût", "Résistance acides organiques"]
        },
        "good": {
          materials: ["304 Stainless Steel", "Polyéthylène Dense", "Résines Alimentaires"],
          reasons: ["Compatible vin", "Résistance alcool-acide"]
        },
        "poor": {
          materials: ["Aluminum Anodisé", "PVC Food", "Caoutchouc Spécial"],
          reasons: ["Interaction légère", "Nécessite surveillance", "Vieillissement accéléré"]
        },
        "incompatible": {
          materials: ["Fer", "Cuivre Nu", "Plomb", "PVC Standard", "Caoutchouc Naturel"],
          reasons: ["Casse métallique", "Goûts indésirables", "Contamination", "Altération aromatique"]
        }
      }
    },

    "bleach": {
      name: "Eau de Javel (5% NaClO)",
      ph_range: "11.5-13.0",
      corrosiveness: "Très Élevée",
      temperature_limits: "5°C à +25°C",
      active_chlorine: "5% NaClO",
      icon: "🧽",
      compatibility: {
        "excellent": {
          materials: ["PVC", "CPVC", "PTFE", "Viton Résistant Chlore", "PVDF"],
          reasons: ["Résistance chlore excellente", "Pas de dégradation", "Usage désinfection certifié"]
        },
        "good": {
          materials: ["PEHD", "PP (court terme)", "Céramique Émaillée"],
          reasons: ["Résistance acceptable", "Usage limité dans le temps"]
        },
        "poor": {
          materials: ["304 Stainless Steel", "Caoutchouc EPDM", "Silicone Standard"],
          reasons: ["Corrosion par piqûres", "Dégradation progressive", "Durée de vie limitée"]
        },
        "incompatible": {
          materials: ["Acier Carbone", "Aluminum", "Cuivre", "Laiton", "316L Stainless (prolongé)", "NBR"],
          reasons: ["Corrosion rapide", "Réaction violente", "Dégagement gazeux", "Défaillance immédiate"]
        }
      }
    },

    "yogurt": {
      name: "Yaourt Nature",
      ph_range: "4.0-4.4",
      corrosiveness: "Faible (Acide Lactique)",
      temperature_limits: "2°C à +45°C",
      lactic_acid: "0.8% acide lactique",
      icon: "🥛",
      compatibility: {
        "excellent": {
          materials: ["316L Stainless Steel", "Verre", "PTFE", "Silicone Alimentaire", "EPDM Food Grade"],
          reasons: ["Résistance acide lactique", "Usage laitier certifié", "Facilité stérilisation"]
        },
        "good": {
          materials: ["304 Stainless Steel", "PP Food Grade", "HDPE Alimentaire"],
          reasons: ["Compatible produits fermentés", "Nettoyage efficace"]
        },
        "poor": {
          materials: ["Aluminum Anodisé", "PVC Alimentaire", "Étain"],
          reasons: ["Interaction acide faible", "Coloration possible", "Surveillance requise"]
        },
        "incompatible": {
          materials: ["Fer", "Cuivre", "Zinc", "Caoutchouc Naturel", "Acier Galvanisé"],
          reasons: ["Contamination métallique", "Altération bactérienne", "Goûts métalliques"]
        }
      }
    },

    "tomato_sauce": {
      name: "Sauce Tomate Concentrée",
      ph_range: "4.0-4.6",
      corrosiveness: "Modérée (Acide + Sel)",
      temperature_limits: "5°C à +95°C",
      salt_content: "2.5% NaCl",
      icon: "🍅",
      compatibility: {
        "excellent": {
          materials: ["316L Stainless Steel", "Verre", "PTFE", "Céramique Émaillée", "Émail Vitrifié"],
          reasons: ["Résistance acides organiques", "Pas d'interaction sel", "Usage conserverie certifié"]
        },
        "good": {
          materials: ["304 Stainless Steel", "Résines Époxy", "HDPE Food Grade"],
          reasons: ["Compatible tomate", "Résistance température-acidité"]
        },
        "poor": {
          materials: ["Aluminum Traité", "PVC Rigide", "Polyester"],
          reasons: ["Interaction acide-sel", "Coloration progressive", "Durée limitée"]
        },
        "incompatible": {
          materials: ["Fer", "Étain Non Protégé", "Cuivre", "Zinc", "Caoutchouc Standard"],
          reasons: ["Corrosion acide", "Contamination métallique", "Altération couleur/goût"]
        }
      }
    },

    "soap_solution": {
      name: "Solution Savonneuse (2%)",
      ph_range: "9.0-11.0",
      corrosiveness: "Faible (Basique)",
      temperature_limits: "15°C à +60°C",
      surfactant_content: "2% agents actifs",
      icon: "🧼",
      compatibility: {
        "excellent": {
          materials: ["Stainless Steel", "PVC", "PP", "PTFE", "Polyuréthane", "EPDM"],
          reasons: ["Résistance détergents", "Usage nettoyage standard", "Pas de dégradation"]
        },
        "good": {
          materials: ["Aluminum Anodisé", "HDPE", "ABS", "Polycarbonate"],
          reasons: ["Compatible détergents", "Résistance alcaline acceptable"]
        },
        "poor": {
          materials: ["Aluminum Nu", "Magnésium", "Caoutchouc Naturel"],
          reasons: ["Attaque alcaline légère", "Gonflement", "Dégradation lente"]
        },
        "incompatible": {
          materials: ["Zinc", "Étain", "Plomb", "Matériaux Poreux"],
          reasons: ["Corrosion alcaline", "Dissolution", "Absorption détergents"]
        }
      }
    },

    "fruit_juice": {
      name: "Jus de Fruits (Orange)",
      ph_range: "3.3-4.2",
      corrosiveness: "Modérée (Acide Citrique)",
      temperature_limits: "2°C à +85°C",
      vitamin_c: "50 mg/100ml",
      icon: "🧃",
      compatibility: {
        "excellent": {
          materials: ["316L Stainless Steel", "Verre", "PTFE", "Silicone Food Grade", "Émail Porcelaine"],
          reasons: ["Résistance acides de fruits", "Préservation vitamines", "Usage alimentaire certifié"]
        },
        "good": {
          materials: ["304 Stainless Steel", "PP Food Grade", "HDPE Alimentaire", "Céramique"],
          reasons: ["Compatible jus de fruits", "Résistance acide citrique"]
        },
        "poor": {
          materials: ["Aluminum Anodisé", "PVC Food", "Résines Standard"],
          reasons: ["Interaction acide faible", "Possible migration", "Altération légère"]
        },
        "incompatible": {
          materials: ["Fer", "Cuivre", "Étain Nu", "Caoutchouc Naturel", "Plomb"],
          reasons: ["Destruction vitamine C", "Contamination métallique", "Oxydation", "Goûts métalliques"]
        }
      }
    }
  };

  // Fonction pour obtenir la couleur de compatibilité
  const getCompatibilityColor = (level) => {
    switch(level) {
      case 'excellent': return 'bg-green-100 border-green-400 text-green-800';
      case 'good': return 'bg-blue-100 border-blue-400 text-blue-800';
      case 'poor': return 'bg-yellow-100 border-yellow-400 text-yellow-800';
      case 'incompatible': return 'bg-red-100 border-red-400 text-red-800';
      default: return 'bg-gray-100 border-gray-400 text-gray-800';
    }
  };

  const getCompatibilityIcon = (level) => {
    switch(level) {
      case 'excellent': return '✅';
      case 'good': return '👍';
      case 'poor': return '⚠️';
      case 'incompatible': return '❌';
      default: return '❓';
    }
  };

  const getCompatibilityTitle = (level) => {
    switch(level) {
      case 'excellent': return 'EXCELLENT';
      case 'good': return 'BON';
      case 'poor': return 'MÉDIOCRE';
      case 'incompatible': return 'INCOMPATIBLE';
      default: return 'INCONNU';
    }
  };

  const selectedFluidData = selectedFluid ? chemicalCompatibilityDatabase[selectedFluid] : null;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">🧪 COMPATIBILITÉ CHIMIQUE FLUIDES-MATÉRIAUX</h2>
        <p className="text-purple-100">
          Sélectionnez un fluide pour visualiser sa compatibilité avec les matériaux d'installation
        </p>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>✅ Standards ASTM</div>
          <div>✅ Normes ISO 23936</div>
          <div>✅ Codes ASME</div>
          <div>✅ Certifications FDA</div>
        </div>
      </div>

      {/* Sélection du fluide */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🔍 Sélectionnez un fluide à analyser
          </label>
          <select
            value={selectedFluid}
            onChange={(e) => setSelectedFluid(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base"
          >
            <option value="">-- Choisir un fluide --</option>
            {Object.entries(chemicalCompatibilityDatabase).map(([key, fluid]) => (
              <option key={key} value={key}>
                {fluid.icon} {fluid.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Légende */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">📋 Légende des Niveaux de Compatibilité</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`p-3 rounded-lg border-2 ${getCompatibilityColor('excellent')}`}>
            <div className="font-bold">✅ EXCELLENT</div>
            <div className="text-sm">Compatibilité parfaite - Usage long terme</div>
          </div>
          <div className={`p-3 rounded-lg border-2 ${getCompatibilityColor('good')}`}>
            <div className="font-bold">👍 BON</div>
            <div className="text-sm">Compatible - Surveillance recommandée</div>
          </div>
          <div className={`p-3 rounded-lg border-2 ${getCompatibilityColor('poor')}`}>
            <div className="font-bold">⚠️ MÉDIOCRE</div>
            <div className="text-sm">Usage limité - Maintenance fréquente</div>
          </div>
          <div className={`p-3 rounded-lg border-2 ${getCompatibilityColor('incompatible')}`}>
            <div className="font-bold">❌ INCOMPATIBLE</div>
            <div className="text-sm">À éviter - Risque de défaillance</div>
          </div>
        </div>
      </div>

      {/* Affichage des compatibilités du fluide sélectionné */}
      {selectedFluidData && (
        <div className="bg-white rounded-lg shadow-lg border-l-4 border-purple-400 overflow-hidden">
          <div className="p-6">
            {/* En-tête fluide sélectionné */}
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-3xl">{selectedFluidData.icon}</span>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedFluidData.name}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                  <span className="bg-gray-100 px-2 py-1 rounded"><strong>pH:</strong> {selectedFluidData.ph_range}</span>
                  <span className="bg-gray-100 px-2 py-1 rounded"><strong>Corrosion:</strong> {selectedFluidData.corrosiveness}</span>
                  <span className="bg-gray-100 px-2 py-1 rounded"><strong>Température:</strong> {selectedFluidData.temperature_limits}</span>
                  {selectedFluidData.salinity && (
                    <span className="bg-gray-100 px-2 py-1 rounded"><strong>Salinité:</strong> {selectedFluidData.salinity}</span>
                  )}
                  {selectedFluidData.volatility && (
                    <span className="bg-gray-100 px-2 py-1 rounded"><strong>Volatilité:</strong> {selectedFluidData.volatility}</span>
                  )}
                  {selectedFluidData.toxicity && (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded"><strong>⚠️ Toxicité:</strong> {selectedFluidData.toxicity}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Matrice de compatibilité */}
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">🔍 Compatibilité avec les Matériaux</h4>
              
              {Object.entries(selectedFluidData.compatibility).map(([compatLevel, compatData]) => (
                compatData.materials.length > 0 && (
                  <div key={compatLevel} className={`p-4 rounded-lg border-2 ${getCompatibilityColor(compatLevel)}`}>
                    <div className="flex items-center mb-3">
                      <span className="text-lg mr-2">{getCompatibilityIcon(compatLevel)}</span>
                      <h5 className="text-lg font-bold">{getCompatibilityTitle(compatLevel)}</h5>
                      <span className="ml-2 px-2 py-1 text-xs bg-white rounded-full">
                        {compatData.materials.length} matériaux
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <h6 className="font-medium text-sm mb-2">📦 Matériaux recommandés :</h6>
                      <div className="flex flex-wrap gap-2">
                        {compatData.materials.map((material, index) => (
                          <span key={index} className="px-3 py-1 bg-white rounded-md text-sm font-medium shadow-sm border">
                            {material}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h6 className="font-medium text-sm mb-2">💡 Justifications techniques :</h6>
                      <ul className="text-sm space-y-1">
                        {compatData.reasons.map((reason, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              ))}
            </div>

            {/* Avertissement pour fluides dangereux */}
            {(selectedFluid === 'acid' || selectedFluid === 'methanol' || selectedFluid === 'gasoline') && (
              <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                <div className="flex items-start">
                  <span className="text-red-600 text-xl mr-3">⚠️</span>
                  <div>
                    <h6 className="font-bold text-red-800 mb-2">AVERTISSEMENT SÉCURITÉ</h6>
                    <p className="text-red-700 text-sm">
                      Ce fluide présente des risques particuliers. Consulter les fiches de données de sécurité (FDS) 
                      et respecter les réglementations en vigueur pour la manipulation, le stockage et l'installation.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Message si aucun fluide sélectionné */}
      {!selectedFluid && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">🧪</div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">Sélectionnez un fluide</h3>
          <p className="text-gray-500">
            Choisissez un fluide dans la liste déroulante ci-dessus pour voir sa compatibilité avec les matériaux d'installation
          </p>
        </div>
      )}
    </div>
  );
};
const FormulaDatabase = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFormula, setSelectedFormula] = useState(null);

  // Base de données complète des formules hydrauliques utilisées
  const formulaDatabase = {
    // 1. FORMULES NPSHD
    npshd: {
      name: "Calculs NPSH Disponible",
      color: "bg-blue-50 border-blue-200",
      icon: "🟦",
      formulas: [
        {
          id: "npshd_flooded",
          name: "NPSHd - Installation en Charge",
          formula: "NPSHd = (Patm / (ρ × g)) + hasp - (Pv / (ρ × g)) - ΔHasp",
          variables: {
            "NPSHd": "Net Positive Suction Head disponible (m)",
            "Patm": "Pression atmosphérique (Pa) = 101 325 Pa",
            "ρ": "Masse volumique du fluide (kg/m³)",
            "g": "Accélération de la pesanteur = 9.81 m/s²",
            "hasp": "Hauteur d'aspiration en charge (m, positif)",
            "Pv": "Pression de vapeur saturante du fluide (Pa)",
            "ΔHasp": "Pertes de charge totales côté aspiration (m)"
          },
          application: "Pour pompes installées sous le niveau du réservoir (aspiration positive)",
          references: "NF EN ISO 17769-1, API 610"
        },
        {
          id: "npshd_suction_lift",
          name: "NPSHd - Installation en Dépression",
          formula: "NPSHd = (Patm / (ρ × g)) - hasp - (Pv / (ρ × g)) - ΔHasp",
          variables: {
            "NPSHd": "Net Positive Suction Head disponible (m)",
            "Patm": "Pression atmosphérique (Pa) = 101 325 Pa",
            "ρ": "Masse volumique du fluide (kg/m³)",
            "g": "Accélération de la pesanteur = 9.81 m/s²",
            "hasp": "Hauteur d'aspiration en dépression (m, positif)",
            "Pv": "Pression de vapeur saturante du fluide (Pa)",
            "ΔHasp": "Pertes de charge totales côté aspiration (m)"
          },
          application: "Pour pompes installées au-dessus du niveau du réservoir",
          references: "NF EN ISO 17769-1, Hydraulic Institute Standards"
        }
      ]
    },

    // 2. FORMULES PERTES DE CHARGE
    head_loss: {
      name: "Pertes de Charge Hydrauliques",
      color: "bg-red-50 border-red-200",
      icon: "📉",
      formulas: [
        {
          id: "darcy_weisbach",
          name: "Formule de Darcy-Weisbach",
          formula: "ΔH = f × (L / D) × (V² / (2 × g))",
          variables: {
            "ΔH": "Perte de charge linéaire (m)",
            "f": "Coefficient de friction (sans dimension)",
            "L": "Longueur de la conduite (m)",
            "D": "Diamètre intérieur de la conduite (m)",
            "V": "Vitesse moyenne du fluide (m/s)",
            "g": "Accélération de la pesanteur = 9.81 m/s²"
          },
          application: "Calcul des pertes de charge en conduite cylindrique",
          references: "ISO 4006, Moody Diagram"
        },
        {
          id: "reynolds_number",
          name: "Nombre de Reynolds",
          formula: "Re = (ρ × V × D) / μ",
          variables: {
            "Re": "Nombre de Reynolds (sans dimension)",
            "ρ": "Masse volumique du fluide (kg/m³)",
            "V": "Vitesse moyenne du fluide (m/s)",
            "D": "Diamètre intérieur de la conduite (m)",
            "μ": "Viscosité dynamique du fluide (Pa·s)"
          },
          application: "Détermination du régime d'écoulement (laminaire Re < 2300, turbulent Re > 4000)",
          references: "Mécanique des fluides, Reynolds (1883)"
        },
        {
          id: "colebrook_white",
          name: "Équation de Colebrook-White",
          formula: "1/√f = -2 × log₁₀((ε/D)/3.7 + 2.51/(Re×√f))",
          variables: {
            "f": "Coefficient de friction (sans dimension)",
            "ε": "Rugosité absolue de la conduite (m)",
            "D": "Diamètre intérieur de la conduite (m)",
            "Re": "Nombre de Reynolds (sans dimension)"
          },
          application: "Calcul du coefficient de friction pour écoulement turbulent",
          references: "Colebrook & White (1937), ISO 4006"
        }
      ]
    },

    // 3. FORMULES HMT
    hmt: {
      name: "Hauteur Manométrique Totale",
      color: "bg-green-50 border-green-200", 
      icon: "🟩",
      formulas: [
        {
          id: "hmt_total",
          name: "HMT - Formule Générale",
          formula: "HMT = Hgéo + ΔHtotal + ΔPutile/(ρ×g)",
          variables: {
            "HMT": "Hauteur Manométrique Totale (m)",
            "Hgéo": "Hauteur géométrique = hrefoulement + haspiration (m)",
            "ΔHtotal": "Pertes de charge totales = ΔHasp + ΔHref (m)",
            "ΔPutile": "Pression utile requise (Pa)",
            "ρ": "Masse volumique du fluide (kg/m³)",
            "g": "Accélération de la pesanteur = 9.81 m/s²"
          },
          application: "Calcul de la hauteur totale que doit fournir la pompe",
          references: "NF EN 809, ISO 17769"
        },
        {
          id: "static_head",
          name: "Hauteur Statique",
          formula: "Hstatique = hrefoulement - haspiration",
          variables: {
            "Hstatique": "Hauteur statique (m)",
            "hrefoulement": "Niveau de refoulement (m)",
            "haspiration": "Niveau d'aspiration (m, négatif si en dépression)"
          },
          application: "Calcul de la différence d'altitude entre aspiration et refoulement",
          references: "Principes de base hydraulique"
        }
      ]
    },

    // 4. FORMULES PUISSANCE ET ÉLECTRICITÉ
    power: {
      name: "Calculs de Puissance et Électriques",
      color: "bg-yellow-50 border-yellow-200",
      icon: "⚡",
      formulas: [
        {
          id: "hydraulic_power",
          name: "Puissance Hydraulique",
          formula: "Ph = (ρ × g × Q × HMT) / 1000",
          variables: {
            "Ph": "Puissance hydraulique (kW)",
            "ρ": "Masse volumique du fluide (kg/m³)",
            "g": "Accélération de la pesanteur = 9.81 m/s²",
            "Q": "Débit volumique (m³/s)",
            "HMT": "Hauteur Manométrique Totale (m)"
          },
          application: "Puissance théorique nécessaire pour élever le fluide",
          references: "Principes thermodynamiques"
        },
        {
          id: "absorbed_power",
          name: "Puissance Absorbée P2",
          formula: "P2 = (Q × HMT) / (ηpompe × 367)",
          variables: {
            "P2": "Puissance absorbée par la pompe (kW)",
            "Q": "Débit volumique (m³/h)",
            "HMT": "Hauteur Manométrique Totale (m)",
            "ηpompe": "Rendement de la pompe (%)",
            "367": "Constante de conversion (m⁴/h·kW pour l'eau)"
          },
          application: "Puissance mécanique requise à l'arbre de la pompe",
          references: "Calculs normalised pompes centrifuges"
        },
        {
          id: "motor_power",
          name: "Puissance Électrique P1",
          formula: "P1 = P2 / (ηmoteur / 100)",
          variables: {
            "P1": "Puissance électrique absorbée (kW)",
            "P2": "Puissance mécanique absorbée (kW)",
            "ηmoteur": "Rendement du moteur électrique (%)"
          },
          application: "Puissance électrique consommée par le moteur",
          references: "CEI 60034, NEMA MG1"
        },
        {
          id: "nominal_current",
          name: "Courant Nominal",
          formula: "I = P1 / (U × √3 × cos(φ))",
          variables: {
            "I": "Courant nominal (A)",
            "P1": "Puissance électrique (kW)",
            "U": "Tension entre phases (V)",
            "cos(φ)": "Facteur de puissance"
          },
          application: "Calcul du courant de fonctionnement nominal",
          references: "Électrotechnique industrielle"
        }
      ]
    },

    // 5. FORMULES RENDEMENT
    efficiency: {
      name: "Calculs de Rendement",
      color: "bg-purple-50 border-purple-200",
      icon: "📊",
      formulas: [
        {
          id: "overall_efficiency",
          name: "Rendement Global",
          formula: "ηglobal = ηpompe × ηmoteur",
          variables: {
            "ηglobal": "Rendement global du groupe motopompe (%)",
            "ηpompe": "Rendement hydraulique de la pompe (%)", 
            "ηmoteur": "Rendement électrique du moteur (%)"
          },
          application: "Efficacité énergétique globale de l'installation",
          references: "Directive ErP 2009/125/CE, ISO 12723"
        },
        {
          id: "pump_efficiency",
          name: "Rendement Hydraulique Pompe", 
          formula: "ηpompe = Ph / P2 × 100",
          variables: {
            "ηpompe": "Rendement hydraulique de la pompe (%)",
            "Ph": "Puissance hydraulique utile (kW)",
            "P2": "Puissance mécanique absorbée (kW)"
          },
          application: "Efficacité de conversion d'énergie mécanique en énergie hydraulique",
          references: "ISO 9906, Hydraulic Institute"
        }
      ]
    },

    // 6. FORMULES VITESSE ET DÉBIT
    flow: {
      name: "Écoulement et Vitesse",
      color: "bg-cyan-50 border-cyan-200",
      icon: "🌊",
      formulas: [
        {
          id: "flow_velocity",
          name: "Vitesse d'Écoulement",
          formula: "V = Q / A = 4Q / (π × D²)",
          variables: {
            "V": "Vitesse moyenne du fluide (m/s)",
            "Q": "Débit volumique (m³/s)",
            "A": "Section transversale de la conduite (m²)",
            "D": "Diamètre intérieur de la conduite (m)"
          },
          application: "Calcul de la vitesse du fluide dans les conduites",
          references: "Équation de continuité"
        },
        {
          id: "flow_rate_conversion",
          name: "Conversion de Débit",
          formula: "Q(m³/h) = Q(m³/s) × 3600",
          variables: {
            "Q(m³/h)": "Débit en mètres cubes par heure",
            "Q(m³/s)": "Débit en mètres cubes par seconde"
          },
          application: "Conversion entre unités de débit usuelles",
          references: "Système international d'unités"
        }
      ]
    }
  };

  // Fonction de recherche dans les formules
  const getFilteredFormulas = () => {
    let filtered = [];
    
    Object.entries(formulaDatabase).forEach(([categoryKey, category]) => {
      if (selectedCategory === 'all' || selectedCategory === categoryKey) {
        category.formulas.forEach(formula => {
          const searchMatch = searchTerm === '' || 
            formula.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            formula.formula.toLowerCase().includes(searchTerm.toLowerCase()) ||
            Object.values(formula.variables).some(variable => 
              variable.toLowerCase().includes(searchTerm.toLowerCase())
            );
          
          if (searchMatch) {
            filtered.push({
              ...formula,
              category: categoryKey,
              categoryName: category.name,
              categoryColor: category.color,
              categoryIcon: category.icon
            });
          }
        });
      }
    });
    
    return filtered;
  };

  const filteredFormulas = getFilteredFormulas();

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">📚 BASE DE DONNÉES DES FORMULES HYDRAULIQUES</h2>
        <p className="text-blue-100">
          Référentiel technique complet des équations utilisées dans les calculs de pompes centrifuges
        </p>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>✅ Conformité ISO 17769</div>
          <div>✅ Standards API 610</div>
          <div>✅ Normes Hydraulic Institute</div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recherche */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔍 Recherche dans les formules
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Rechercher par nom, formule ou variable..."
            />
          </div>

          {/* Filtre par catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📂 Catégorie de formules
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Toutes les formules ({Object.values(formulaDatabase).reduce((acc, cat) => acc + cat.formulas.length, 0)})</option>
              {Object.entries(formulaDatabase).map(([key, category]) => (
                <option key={key} value={key}>
                  {category.icon} {category.name} ({category.formulas.length})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Statistiques */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{filteredFormulas.length}</div>
            <div className="text-sm text-blue-800">Formules trouvées</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{Object.keys(formulaDatabase).length}</div>
            <div className="text-sm text-green-800">Catégories</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-600">ISO</div>
            <div className="text-sm text-purple-800">Conformité</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-600">API</div>
            <div className="text-sm text-yellow-800">Standards</div>
          </div>
        </div>
      </div>

      {/* Liste des formules */}
      <div className="grid grid-cols-1 gap-6">
        {filteredFormulas.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-gray-500 text-lg">
              🔍 Aucune formule trouvée pour "{searchTerm}"
            </div>
            <p className="text-gray-400 mt-2">
              Essayez avec d'autres termes de recherche ou sélectionnez une autre catégorie
            </p>
          </div>
        ) : (
          filteredFormulas.map((formula) => (
            <div 
              key={`${formula.category}-${formula.id}`}
              className={`bg-white rounded-lg shadow-lg border-l-4 ${formula.categoryColor.replace('bg-', 'border-').replace('-50', '-400')} overflow-hidden`}
            >
              <div className="p-6">
                {/* En-tête formule */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{formula.categoryIcon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{formula.name}</h3>
                      <p className="text-sm text-gray-600">{formula.categoryName}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFormula(selectedFormula === formula.id ? null : formula.id)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {selectedFormula === formula.id ? 'Réduire' : 'Détails'}
                  </button>
                </div>

                {/* Formule mathématique */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="text-sm text-gray-600 mb-2">Formule mathématique:</div>
                  <div className="font-mono text-lg text-gray-900 font-medium">
                    {formula.formula}
                  </div>
                </div>

                {/* Variables (toujours visibles) */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">📋 Variables et unités:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.entries(formula.variables).map(([symbol, description], index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="font-mono font-bold text-blue-600 min-w-fit">{symbol}:</span>
                        <span className="text-gray-700 text-sm">{description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Détails (conditionnels) */}
                {selectedFormula === formula.id && (
                  <div className="border-t pt-4 mt-4 space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">🎯 Application pratique:</h4>
                      <p className="text-gray-700">{formula.application}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">📖 Références normatives:</h4>
                      <p className="text-gray-700">{formula.references}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
const NPSHdCalculator = ({ fluids, pipeMaterials, fittings }) => {
  const [inputData, setInputData] = useState({
    suction_type: 'flooded',
    hasp: 3.0,
    flow_rate: 50,
    fluid_type: 'water',
    temperature: 20,
    pipe_diameter: 100,
    pipe_material: 'pvc',
    pipe_length: 50,
    suction_fittings: [],
    npsh_required: 3.5  // Nouveau champ pour NPSH requis
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setInputData(prev => ({ ...prev, [field]: value }));
  };

  const addFitting = () => {
    setInputData(prev => ({
      ...prev,
      suction_fittings: [...prev.suction_fittings, { fitting_type: 'elbow_90', quantity: 1 }]
    }));
  };

  const removeFitting = (index) => {
    setInputData(prev => ({
      ...prev,
      suction_fittings: prev.suction_fittings.filter((_, i) => i !== index)
    }));
  };

  const updateFitting = (index, field, value) => {
    setInputData(prev => ({
      ...prev,
      suction_fittings: prev.suction_fittings.map((fitting, i) => 
        i === index ? { ...fitting, [field]: value } : fitting
      )
    }));
  };

  const calculateNPSHd = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API}/calculate-npshd`, inputData);
      setResult(response.data);
    } catch (error) {
      console.error('Erreur calcul NPSHd:', error);
      alert('Erreur lors du calcul NPSHd: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">🟦 Calcul NPSHd (Net Positive Suction Head Available)</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Paramètres principaux */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Paramètres Principaux</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type d'Aspiration
                </label>
                <select
                  value={inputData.suction_type}
                  onChange={(e) => handleInputChange('suction_type', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="flooded">Aspiration en charge</option>
                  <option value="suction_lift">Aspiration en dépression</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hauteur d'Aspiration Hasp (m)
                </label>
                <input
                  type="number"
                  value={inputData.hasp}
                  onChange={(e) => handleInputChange('hasp', parseFloat(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  style={{ MozAppearance: 'textfield', WebkitAppearance: 'none' }}
                />
                <style jsx>{`
                  input[type="number"]::-webkit-outer-spin-button,
                  input[type="number"]::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                  }
                  input[type="number"] {
                    -moz-appearance: textfield;
                  }
                `}</style>
                <p className="text-xs text-gray-500 mt-1">
                  {inputData.suction_type === 'flooded' ? 'Hauteur de fluide au-dessus de la pompe' : 'Hauteur de dénivelé à aspirer'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Débit (m³/h)
                </label>
                <input
                  type="number"
                  value={inputData.flow_rate}
                  onChange={(e) => handleInputChange('flow_rate', parseFloat(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de Fluide
                </label>
                <select
                  value={inputData.fluid_type}
                  onChange={(e) => handleInputChange('fluid_type', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {fluids.map(fluid => (
                    <option key={fluid.id} value={fluid.id}>{fluid.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Température (°C)
                </label>
                <input
                  type="number"
                  value={inputData.temperature}
                  onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NPSH Requis (m) - Données Constructeur
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputData.npsh_required}
                  onChange={(e) => handleInputChange('npsh_required', parseFloat(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: 3.5"
                />
              </div>
            </div>
          </div>
          
          {/* Tuyauterie */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Tuyauterie d'Aspiration</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diamètre (mm)
                </label>
                <input
                  type="number"
                  value={inputData.pipe_diameter}
                  onChange={(e) => handleInputChange('pipe_diameter', parseFloat(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Matériau
                </label>
                <select
                  value={inputData.pipe_material}
                  onChange={(e) => handleInputChange('pipe_material', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {pipeMaterials.map(material => (
                    <option key={material.id} value={material.id}>{material.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longueur (m)
                </label>
                <input
                  type="number"
                  value={inputData.pipe_length}
                  onChange={(e) => handleInputChange('pipe_length', parseFloat(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Raccords */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-gray-700">Raccords d'Aspiration</h3>
            <button
              onClick={addFitting}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              + Ajouter Raccord
            </button>
          </div>
          
          <div className="space-y-2">
            {inputData.suction_fittings.map((fitting, index) => (
              <div key={index} className="flex items-center space-x-2">
                <select
                  value={fitting.fitting_type}
                  onChange={(e) => updateFitting(index, 'fitting_type', e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {fittings.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={fitting.quantity}
                  onChange={(e) => updateFitting(index, 'quantity', parseInt(e.target.value))}
                  min="1"
                  className="w-20 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={() => removeFitting(index)}
                  className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={calculateNPSHd}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {loading ? 'Calcul en cours...' : 'Calculer NPSHd'}
          </button>
        </div>
      </div>
      
      {/* Résultats */}
      {result && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Résultats NPSHd</h3>
          
          {result.warnings && result.warnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-yellow-800 mb-2">⚠️ Avertissements</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                {result.warnings.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700 border-b pb-2">Paramètres Calculés</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Pression atmosphérique:</span>
                  <span className="font-medium">{(result.atmospheric_pressure / 1000).toFixed(1)} kPa</span>
                </div>
                <div className="flex justify-between">
                  <span>Vitesse:</span>
                  <span className="font-medium">{result.velocity?.toFixed(2)} m/s</span>
                </div>
                <div className="flex justify-between">
                  <span>Nombre de Reynolds:</span>
                  <span className="font-medium">{result.reynolds_number?.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Facteur de friction:</span>
                  <span className="font-medium">{result.friction_factor?.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pression vapeur:</span>
                  <span className="font-medium">{(result.fluid_properties.vapor_pressure / 1000).toFixed(1)} kPa</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700 border-b pb-2">Pertes de Charge</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Pertes linéaires:</span>
                  <span className="font-medium">{result.linear_head_loss?.toFixed(2)} m</span>
                </div>
                <div className="flex justify-between">
                  <span>Pertes singulières:</span>
                  <span className="font-medium">{result.singular_head_loss?.toFixed(2)} m</span>
                </div>
                <div className="flex justify-between">
                  <span>Pertes totales:</span>
                  <span className="font-medium">{result.total_head_loss?.toFixed(2)} m</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold">NPSHd:</span>
                  <span className="font-bold text-blue-600">{result.npshd?.toFixed(2)} m</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Section Comparaison NPSH et Analyse de Cavitation */}
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Analyse de Cavitation</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700 border-b pb-2">Comparaison NPSH</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>NPSH Requis (constructeur):</span>
                    <span className="font-medium">{result.npsh_required?.toFixed(2)} m</span>
                  </div>
                  <div className="flex justify-between">
                    <span>NPSHd Calculé:</span>
                    <span className="font-medium">{result.npshd?.toFixed(2)} m</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">Marge de sécurité:</span>
                    <span className={`font-bold ${result.npsh_margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {result.npsh_margin?.toFixed(2)} m
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700 border-b pb-2">Statut de Cavitation</h4>
                <div className="text-center">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                    result.cavitation_risk ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {result.cavitation_risk ? '🚨 RISQUE DE CAVITATION' : '✅ AUCUN RISQUE'}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    {result.cavitation_risk ? 
                      'Des corrections sont nécessaires' : 
                      'Installation sécurisée'
                    }
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recommandations de correction */}
            {result.recommendations && result.recommendations.length > 0 && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-3">💡 Recommandations de Correction</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  {result.recommendations.map((recommendation, index) => (
                    <li key={index} className="leading-relaxed">
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Schéma d'Installation Dynamique */}
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Schéma d'Installation Dynamique</h3>
            
            <div className="flex justify-center">
              <svg width="600" height="400" viewBox="0 0 600 400" className="border border-gray-200 rounded-lg">
                {/* Fond */}
                <rect width="600" height="400" fill="#f8fafc" />
                
                {/* Configuration dynamique selon le type d'aspiration */}
                {(() => {
                  const isFlooded = inputData.suction_type === 'flooded';
                  const reservoirY = isFlooded ? 150 : 250;
                  const reservoirHeight = isFlooded ? 100 : 80;
                  const pumpY = isFlooded ? 280 : 180;
                  const waterLevel = reservoirY + 20;
                  
                  // Calcul de la hauteur dynamique
                  const heightScale = Math.min(Math.max(inputData.hasp * 15, 30), 120);
                  const actualPumpY = isFlooded ? waterLevel + heightScale : waterLevel - heightScale;
                  
                  return (
                    <>
                      {/* Réservoir */}
                      <rect 
                        x="50" 
                        y={reservoirY} 
                        width="180" 
                        height={reservoirHeight} 
                        fill="#e5e7eb" 
                        stroke="#6b7280" 
                        strokeWidth="2"
                      />
                      
                      {/* Niveau d'eau */}
                      <rect 
                        x="55" 
                        y={waterLevel} 
                        width="170" 
                        height={reservoirHeight - 25} 
                        fill="#3b82f6" 
                        opacity="0.6"
                      />
                      
                      {/* Étiquette du réservoir */}
                      <text x="140" y={reservoirY - 10} textAnchor="middle" className="text-sm font-medium" fill="#1f2937">
                        Réservoir
                      </text>
                      
                      {/* Ligne d'eau */}
                      <line x1="50" y1={waterLevel} x2="230" y2={waterLevel} stroke="#1d4ed8" strokeWidth="2" strokeDasharray="5,5" />
                      <text x="240" y={waterLevel + 5} className="text-xs font-medium" fill="#1d4ed8">
                        Niveau d'eau
                      </text>
                      
                      {/* Tuyauterie d'aspiration */}
                      <line 
                        x1="230" 
                        y1={waterLevel} 
                        x2="350" 
                        y2={actualPumpY + 25} 
                        stroke="#4b5563" 
                        strokeWidth="6"
                      />
                      <circle cx="230" cy={waterLevel} r="3" fill="#4b5563" />
                      
                      {/* Pompe - Position dynamique */}
                      <rect 
                        x="350" 
                        y={actualPumpY} 
                        width="70" 
                        height="50" 
                        fill="#10b981" 
                        stroke="#059669" 
                        strokeWidth="2"
                        rx="5"
                      />
                      <text x="385" y={actualPumpY + 30} textAnchor="middle" className="text-xs font-bold" fill="white">
                        POMPE
                      </text>
                      
                      {/* Tuyauterie de refoulement */}
                      <line 
                        x1="420" 
                        y1={actualPumpY + 25} 
                        x2="500" 
                        y2={actualPumpY + 25} 
                        stroke="#4b5563" 
                        strokeWidth="6"
                      />
                      <line 
                        x1="500" 
                        y1={actualPumpY + 25} 
                        x2="500" 
                        y2="120" 
                        stroke="#4b5563" 
                        strokeWidth="6"
                      />
                      
                      {/* Sortie */}
                      <rect x="495" y="115" width="10" height="10" fill="#10b981" />
                      <text x="510" y="125" className="text-xs font-medium" fill="#10b981">
                        Sortie
                      </text>
                      
                      {/* Cotes dynamiques - Hauteur d'aspiration */}
                      <defs>
                        <marker id="arrowRed" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                          <polygon points="0 0, 8 3, 0 6" fill="#ef4444" />
                        </marker>
                        <marker id="arrowGreen" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                          <polygon points="0 0, 8 3, 0 6" fill="#059669" />
                        </marker>
                      </defs>
                      
                      {/* Cote hauteur */}
                      <line 
                        x1="30" 
                        y1={waterLevel} 
                        x2="30" 
                        y2={actualPumpY + 25} 
                        stroke="#ef4444" 
                        strokeWidth="1"
                        markerEnd="url(#arrowRed)"
                      />
                      <line 
                        x1="30" 
                        y1={actualPumpY + 25} 
                        x2="30" 
                        y2={waterLevel} 
                        stroke="#ef4444" 
                        strokeWidth="1"
                        markerEnd="url(#arrowRed)"
                      />
                      
                      <text 
                        x="15" 
                        y={(waterLevel + actualPumpY + 25) / 2} 
                        textAnchor="middle" 
                        className="text-xs font-bold" 
                        fill="#ef4444"
                      >
                        {inputData.hasp.toFixed(1)}m
                      </text>
                      
                      <text 
                        x="15" 
                        y={(waterLevel + actualPumpY + 25) / 2 + 15} 
                        textAnchor="middle" 
                        className="text-xs" 
                        fill="#ef4444"
                      >
                        {isFlooded ? '(en charge)' : '(dépression)'}
                      </text>
                      
                      {/* Flèche de débit */}
                      <line 
                        x1="280" 
                        y1={waterLevel + 10} 
                        x2="320" 
                        y2={actualPumpY + 15} 
                        stroke="#059669" 
                        strokeWidth="3"
                        markerEnd="url(#arrowGreen)"
                      />
                      <text 
                        x="300" 
                        y={(waterLevel + actualPumpY) / 2} 
                        textAnchor="middle" 
                        className="text-xs font-bold" 
                        fill="#059669"
                      >
                        {inputData.flow_rate} m³/h
                      </text>
                      
                      {/* Informations techniques */}
                      <rect x="450" y="30" width="140" height="100" fill="white" stroke="#d1d5db" strokeWidth="1" rx="5" />
                      <text x="460" y="45" className="text-xs font-bold" fill="#1f2937">Paramètres:</text>
                      <text x="460" y="60" className="text-xs" fill="#4b5563">⌀ {inputData.pipe_diameter}mm</text>
                      <text x="460" y="75" className="text-xs" fill="#4b5563">L: {inputData.pipe_length}m</text>
                      <text x="460" y="90" className="text-xs" fill="#4b5563">T: {inputData.temperature}°C</text>
                      <text x="460" y="105" className="text-xs" fill="#4b5563">
                        NPSH req: {inputData.npsh_required}m
                      </text>
                      {result && (
                        <text x="460" y="120" className="text-xs font-bold" fill="#10b981">
                          V: {result.velocity?.toFixed(2)}m/s
                        </text>
                      )}
                      
                      {/* Indicateur de risque */}
                      {result && (
                        <circle 
                          cx="570" 
                          cy="50" 
                          r="8" 
                          fill={result.cavitation_risk ? "#ef4444" : "#10b981"}
                        />
                      )}
                      {result && (
                        <text 
                          x="570" 
                          y="55" 
                          textAnchor="middle" 
                          className="text-xs font-bold" 
                          fill="white"
                        >
                          {result.cavitation_risk ? "!" : "✓"}
                        </text>
                      )}
                    </>
                  );
                })()}
              </svg>
            </div>
            
            <div className="mt-4 text-sm text-gray-600 text-center">
              <p className="font-medium">
                Schéma dynamique - Position de la pompe ajustée selon le type d'aspiration et la hauteur
              </p>
              <p className="text-xs mt-1">
                {inputData.suction_type === 'flooded' ? 
                  '🔵 Configuration "en charge" : Pompe sous le niveau d\'eau' : 
                  '🔴 Configuration "dépression" : Pompe au-dessus du niveau d\'eau'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Component pour Tab 2 - Calcul HMT
const HMTCalculator = ({ fluids, pipeMaterials, fittings }) => {
  const [inputData, setInputData] = useState({
    installation_type: 'surface',
    suction_type: 'flooded',
    hasp: 3.0,
    discharge_height: 25.0,
    useful_pressure: 0,
    suction_pipe_diameter: 100,
    discharge_pipe_diameter: 80,
    suction_pipe_length: 10,
    discharge_pipe_length: 50,
    suction_pipe_material: 'pvc',
    discharge_pipe_material: 'pvc',
    suction_fittings: [],
    discharge_fittings: [],
    fluid_type: 'water',
    temperature: 20,
    flow_rate: 50
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setInputData(prev => ({ ...prev, [field]: value }));
  };

  const addFitting = (type) => {
    setInputData(prev => ({
      ...prev,
      [`${type}_fittings`]: [...prev[`${type}_fittings`], { fitting_type: 'elbow_90', quantity: 1 }]
    }));
  };

  const removeFitting = (type, index) => {
    setInputData(prev => ({
      ...prev,
      [`${type}_fittings`]: prev[`${type}_fittings`].filter((_, i) => i !== index)
    }));
  };

  const updateFitting = (type, index, field, value) => {
    setInputData(prev => ({
      ...prev,
      [`${type}_fittings`]: prev[`${type}_fittings`].map((fitting, i) => 
        i === index ? { ...fitting, [field]: value } : fitting
      )
    }));
  };

  const calculateHMT = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API}/calculate-hmt`, inputData);
      setResult(response.data);
    } catch (error) {
      console.error('Erreur calcul HMT:', error);
      alert('Erreur lors du calcul HMT: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">🟩 Calcul HMT (Hauteur Manométrique Totale)</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Paramètres généraux */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Paramètres Généraux</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type d'Installation
                </label>
                <select
                  value={inputData.installation_type}
                  onChange={(e) => handleInputChange('installation_type', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="surface">Installation en surface</option>
                  <option value="submersible">Installation submersible</option>
                </select>
              </div>
              
              {inputData.installation_type === 'surface' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type d'Aspiration
                    </label>
                    <select
                      value={inputData.suction_type}
                      onChange={(e) => handleInputChange('suction_type', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="flooded">Aspiration en charge</option>
                      <option value="suction_lift">Aspiration en dépression</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hauteur d'Aspiration (m)
                    </label>
                    <input
                      type="number"
                      value={inputData.hasp}
                      onChange={(e) => handleInputChange('hasp', parseFloat(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hauteur de Refoulement (m)
                </label>
                <input
                  type="number"
                  value={inputData.discharge_height}
                  onChange={(e) => handleInputChange('discharge_height', parseFloat(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pression Utile (bar)
                </label>
                <input
                  type="number"
                  value={inputData.useful_pressure}
                  onChange={(e) => handleInputChange('useful_pressure', parseFloat(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Pression de refoulement requise</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Débit (m³/h)
                </label>
                <input
                  type="number"
                  value={inputData.flow_rate}
                  onChange={(e) => handleInputChange('flow_rate', parseFloat(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de Fluide
                </label>
                <select
                  value={inputData.fluid_type}
                  onChange={(e) => handleInputChange('fluid_type', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {fluids.map(fluid => (
                    <option key={fluid.id} value={fluid.id}>{fluid.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Température (°C)
                </label>
                <input
                  type="number"
                  value={inputData.temperature}
                  onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          
          {/* Tuyauteries */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Tuyauteries</h3>
            
            <div className="space-y-3">
              {inputData.installation_type === 'surface' && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Aspiration</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs text-blue-700 mb-1">Diamètre (mm)</label>
                      <input
                        type="number"
                        value={inputData.suction_pipe_diameter}
                        onChange={(e) => handleInputChange('suction_pipe_diameter', parseFloat(e.target.value))}
                        className="w-full p-1 border border-blue-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-blue-700 mb-1">Longueur (m)</label>
                      <input
                        type="number"
                        value={inputData.suction_pipe_length}
                        onChange={(e) => handleInputChange('suction_pipe_length', parseFloat(e.target.value))}
                        className="w-full p-1 border border-blue-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-blue-700 mb-1">Matériau</label>
                      <select
                        value={inputData.suction_pipe_material}
                        onChange={(e) => handleInputChange('suction_pipe_material', e.target.value)}
                        className="w-full p-1 border border-blue-300 rounded text-sm"
                      >
                        {pipeMaterials.map(material => (
                          <option key={material.id} value={material.id}>{material.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-green-50 p-3 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Refoulement</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs text-green-700 mb-1">Diamètre (mm)</label>
                    <input
                      type="number"
                      value={inputData.discharge_pipe_diameter}
                      onChange={(e) => handleInputChange('discharge_pipe_diameter', parseFloat(e.target.value))}
                      className="w-full p-1 border border-green-300 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-green-700 mb-1">Longueur (m)</label>
                    <input
                      type="number"
                      value={inputData.discharge_pipe_length}
                      onChange={(e) => handleInputChange('discharge_pipe_length', parseFloat(e.target.value))}
                      className="w-full p-1 border border-green-300 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-green-700 mb-1">Matériau</label>
                    <select
                      value={inputData.discharge_pipe_material}
                      onChange={(e) => handleInputChange('discharge_pipe_material', e.target.value)}
                      className="w-full p-1 border border-green-300 rounded text-sm"
                    >
                      {pipeMaterials.map(material => (
                        <option key={material.id} value={material.id}>{material.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Raccords */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Raccords aspiration */}
          {inputData.installation_type === 'surface' && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-700">Raccords Aspiration</h4>
                <button
                  onClick={() => addFitting('suction')}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  + Ajouter
                </button>
              </div>
              
              <div className="space-y-2">
                {inputData.suction_fittings.map((fitting, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <select
                      value={fitting.fitting_type}
                      onChange={(e) => updateFitting('suction', index, 'fitting_type', e.target.value)}
                      className="flex-1 p-1 border border-gray-300 rounded text-sm"
                    >
                      {fittings.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={fitting.quantity}
                      onChange={(e) => updateFitting('suction', index, 'quantity', parseInt(e.target.value))}
                      min="1"
                      className="w-16 p-1 border border-gray-300 rounded text-sm"
                    />
                    <button
                      onClick={() => removeFitting('suction', index)}
                      className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Raccords refoulement */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-gray-700">Raccords Refoulement</h4>
              <button
                onClick={() => addFitting('discharge')}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
              >
                + Ajouter
              </button>
            </div>
            
            <div className="space-y-2">
              {inputData.discharge_fittings.map((fitting, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <select
                    value={fitting.fitting_type}
                    onChange={(e) => updateFitting('discharge', index, 'fitting_type', e.target.value)}
                    className="flex-1 p-1 border border-gray-300 rounded text-sm"
                  >
                    {fittings.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={fitting.quantity}
                    onChange={(e) => updateFitting('discharge', index, 'quantity', parseInt(e.target.value))}
                    min="1"
                    className="w-16 p-1 border border-gray-300 rounded text-sm"
                  />
                  <button
                    onClick={() => removeFitting('discharge', index)}
                    className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={calculateHMT}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 font-medium"
          >
            {loading ? 'Calcul en cours...' : 'Calculer HMT'}
          </button>
        </div>
      </div>
      
      {/* Résultats */}
      {result && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Résultats HMT</h3>
          
          {result.warnings && result.warnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-yellow-800 mb-2">⚠️ Avertissements</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                {result.warnings.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700 border-b pb-2">Vitesses</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Aspiration:</span>
                  <span className="font-medium">{result.suction_velocity?.toFixed(2)} m/s</span>
                </div>
                <div className="flex justify-between">
                  <span>Refoulement:</span>
                  <span className="font-medium">{result.discharge_velocity?.toFixed(2)} m/s</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700 border-b pb-2">Pertes de Charge</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Aspiration:</span>
                  <span className="font-medium">{result.suction_head_loss?.toFixed(2)} m</span>
                </div>
                <div className="flex justify-between">
                  <span>Refoulement:</span>
                  <span className="font-medium">{result.discharge_head_loss?.toFixed(2)} m</span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-medium">{result.total_head_loss?.toFixed(2)} m</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700 border-b pb-2">Hauteurs</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Hauteur statique:</span>
                  <span className="font-medium">{result.static_head?.toFixed(2)} m</span>
                </div>
                <div className="flex justify-between">
                  <span>Pression utile:</span>
                  <span className="font-medium">{result.useful_pressure_head?.toFixed(2)} m</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold">HMT:</span>
                  <span className="font-bold text-green-600">{result.hmt?.toFixed(2)} m</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Component pour Tab Expert - Analyse Complète Professionnelle
const ExpertCalculator = ({ fluids, pipeMaterials, fittings }) => {
  // Fonction universelle pour calculer les propriétés des fluides
  const calculateFluidProperties = (fluidType, temperature) => {
    // Base de données des propriétés des fluides (à synchroniser avec le backend)
    const fluidProperties = {
      water: { density_20c: 1000, viscosity_20c: 0.001, vapor_pressure_20c: 2340, temp_coeffs: { density: -0.2, viscosity: -0.00005, vapor_pressure: 100 } },
      oil: { density_20c: 850, viscosity_20c: 0.05, vapor_pressure_20c: 100, temp_coeffs: { density: -0.7, viscosity: -0.002, vapor_pressure: 20 } },
      acid: { density_20c: 1200, viscosity_20c: 0.002, vapor_pressure_20c: 3000, temp_coeffs: { density: -0.3, viscosity: -0.0001, vapor_pressure: 150 } },
      glycol: { density_20c: 1113, viscosity_20c: 0.0161, vapor_pressure_20c: 10, temp_coeffs: { density: -0.8, viscosity: -0.0008, vapor_pressure: 5 } },
      // Nouveaux fluides industriels
      palm_oil: { density_20c: 915, viscosity_20c: 0.045, vapor_pressure_20c: 0.001, temp_coeffs: { density: -0.65, viscosity: -0.0018, vapor_pressure: 0.0001 } },
      gasoline: { density_20c: 740, viscosity_20c: 0.00055, vapor_pressure_20c: 13000, temp_coeffs: { density: -0.9, viscosity: -0.000015, vapor_pressure: 850 } },
      diesel: { density_20c: 840, viscosity_20c: 0.0035, vapor_pressure_20c: 300, temp_coeffs: { density: -0.75, viscosity: -0.00012, vapor_pressure: 25 } },
      hydraulic_oil: { density_20c: 875, viscosity_20c: 0.046, vapor_pressure_20c: 0.1, temp_coeffs: { density: -0.65, viscosity: -0.0019, vapor_pressure: 0.02 } },
      ethanol: { density_20c: 810, viscosity_20c: 0.0012, vapor_pressure_20c: 5870, temp_coeffs: { density: -1.05, viscosity: -0.00004, vapor_pressure: 420 } },
      seawater: { density_20c: 1025, viscosity_20c: 0.00107, vapor_pressure_20c: 2280, temp_coeffs: { density: -0.25, viscosity: -0.000052, vapor_pressure: 95 } },
      methanol: { density_20c: 792, viscosity_20c: 0.00059, vapor_pressure_20c: 12800, temp_coeffs: { density: -1.2, viscosity: -0.000025, vapor_pressure: 780 } },
      glycerol: { density_20c: 1260, viscosity_20c: 1.48, vapor_pressure_20c: 0.001, temp_coeffs: { density: -0.65, viscosity: -0.058, vapor_pressure: 0.0002 } },
      // Nouveaux fluides alimentaires et domestiques
      milk: { density_20c: 1030, viscosity_20c: 0.0015, vapor_pressure_20c: 2200, temp_coeffs: { density: -0.3, viscosity: -0.00006, vapor_pressure: 95 } },
      honey: { density_20c: 1400, viscosity_20c: 8.5, vapor_pressure_20c: 0.1, temp_coeffs: { density: -0.8, viscosity: -0.25, vapor_pressure: 0.02 } },
      wine: { density_20c: 990, viscosity_20c: 0.0012, vapor_pressure_20c: 2800, temp_coeffs: { density: -0.9, viscosity: -0.00004, vapor_pressure: 120 } },
      bleach: { density_20c: 1050, viscosity_20c: 0.0011, vapor_pressure_20c: 2100, temp_coeffs: { density: -0.25, viscosity: -0.000045, vapor_pressure: 90 } },
      yogurt: { density_20c: 1050, viscosity_20c: 0.15, vapor_pressure_20c: 2150, temp_coeffs: { density: -0.35, viscosity: -0.008, vapor_pressure: 92 } },
      tomato_sauce: { density_20c: 1100, viscosity_20c: 2.5, vapor_pressure_20c: 1800, temp_coeffs: { density: -0.4, viscosity: -0.12, vapor_pressure: 75 } },
      soap_solution: { density_20c: 1010, viscosity_20c: 0.0013, vapor_pressure_20c: 2250, temp_coeffs: { density: -0.28, viscosity: -0.00005, vapor_pressure: 95 } },
      fruit_juice: { density_20c: 1045, viscosity_20c: 0.0018, vapor_pressure_20c: 2100, temp_coeffs: { density: -0.35, viscosity: -0.00007, vapor_pressure: 88 } }
    };

    const fluid = fluidProperties[fluidType];
    if (!fluid) return { density: 1000, viscosity: 0.001, vapor_pressure: 2340 };

    const tempDiff = temperature - 20;
    
    return {
      density: Math.max(fluid.density_20c + fluid.temp_coeffs.density * tempDiff, 500),
      viscosity: Math.max(fluid.viscosity_20c + fluid.temp_coeffs.viscosity * tempDiff, 0.0001),
      vapor_pressure: Math.max(fluid.vapor_pressure_20c + fluid.temp_coeffs.vapor_pressure * tempDiff, 1)
    };
  };

  const [inputData, setInputData] = useState({
    // Informations projet
    engineer_name: '',
    engineer_firstname: '',
    company_name: '',
    engineer_phone: '',
    engineer_email: '',
    
    // Paramètres hydrauliques principaux
    flow_rate: 0,
    fluid_type: 'water',
    temperature: 20, // Valeur de référence
    
    // Géométrie installation
    suction_type: 'flooded',
    suction_pipe_diameter: 0,
    discharge_pipe_diameter: 0,
    suction_height: 0,
    discharge_height: 0,
    suction_length: 0,
    discharge_length: 0,
    total_length: 0,
    
    // Pression utile
    useful_pressure: 0,
    
    // Matériaux et équipements
    suction_material: 'pvc',
    discharge_material: 'pvc',
    
    // Singularités ASPIRATION (quantités usuelles)
    suction_elbow_90: 1, // Au moins 1 coude usuel
    suction_elbow_45: 0,
    suction_elbow_30: 0,
    suction_tee_flow: 0,
    suction_tee_branch: 0,
    suction_reducer_gradual: 0,
    suction_reducer_sudden: 0,
    suction_enlarger_gradual: 0,
    suction_enlarger_sudden: 0,
    suction_gate_valve: 0,
    suction_globe_valve: 0,
    suction_ball_valve: 0,
    suction_butterfly_valve: 0,
    suction_check_valve: 0,
    suction_strainer: 1, // Crépine usuelle
    suction_foot_valve: 0,
    
    // Singularités REFOULEMENT (quantités usuelles)
    discharge_elbow_90: 2, // Coudes usuels
    discharge_elbow_45: 0,
    discharge_elbow_30: 0,
    discharge_tee_flow: 0,
    discharge_tee_branch: 0,
    discharge_reducer_gradual: 0,
    discharge_reducer_sudden: 0,
    discharge_enlarger_gradual: 0,
    discharge_enlarger_sudden: 0,
    discharge_gate_valve: 1, // Vanne d'arrêt usuelle
    discharge_globe_valve: 0,
    discharge_ball_valve: 0,
    discharge_butterfly_valve: 0,
    discharge_check_valve: 1, // Clapet anti-retour usuel
    discharge_strainer: 0,
    discharge_flow_meter: 0,
    discharge_pressure_gauge: 1, // Manomètre usuel
    
    // Paramètres électriques
    pump_efficiency: 75, // Valeur par défaut réaliste
    motor_efficiency: 85, // Valeur par défaut réaliste
    voltage: 400,
    power_factor: 0.8, // Valeur de référence
    starting_method: 'star_delta',
    cable_length: 0,
    cable_material: 'copper',
    cable_section: null,
    voltage_drop: 0, // Nouvelle valeur pour chute de tension
    
    // Paramètres avancés
    npsh_required: 0,
    installation_type: 'surface',
    pump_type: 'centrifugal',
    operating_hours: 4000, // Valeur de référence (h/an)
    electricity_cost: 96, // Prix de référence en FCFA
    
    // Conditions environnementales
    altitude: 0,
    ambient_temperature: 25, // Valeur de référence
    humidity: 60 // Valeur de référence
  });

  // Table de correspondance DN/mm (diamètres intérieurs réels)
  const dnSizes = [
    { dn: 'DN20', mm: 26.9, label: 'DN20 (26.9mm)' },
    { dn: 'DN25', mm: 33.7, label: 'DN25 (33.7mm)' },
    { dn: 'DN32', mm: 42.4, label: 'DN32 (42.4mm)' },
    { dn: 'DN40', mm: 48.3, label: 'DN40 (48.3mm)' },
    { dn: 'DN50', mm: 60.3, label: 'DN50 (60.3mm)' },
    { dn: 'DN65', mm: 76.1, label: 'DN65 (76.1mm)' },
    { dn: 'DN80', mm: 88.9, label: 'DN80 (88.9mm)' },
    { dn: 'DN100', mm: 114.3, label: 'DN100 (114.3mm)' },
    { dn: 'DN125', mm: 139.7, label: 'DN125 (139.7mm)' },
    { dn: 'DN150', mm: 168.3, label: 'DN150 (168.3mm)' },
    { dn: 'DN200', mm: 219.1, label: 'DN200 (219.1mm)' },
    { dn: 'DN250', mm: 273.1, label: 'DN250 (273.1mm)' },
    { dn: 'DN300', mm: 323.9, label: 'DN300 (323.9mm)' },
    { dn: 'DN350', mm: 355.6, label: 'DN350 (355.6mm)' },
    { dn: 'DN400', mm: 406.4, label: 'DN400 (406.4mm)' },
    { dn: 'DN450', mm: 457.2, label: 'DN450 (457.2mm)' },
    { dn: 'DN500', mm: 508, label: 'DN500 (508mm)' }
  ];

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [autoCalculate, setAutoCalculate] = useState(true);
  const [activeSection, setActiveSection] = useState('all');
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const handleInputChange = (field, value) => {
    // Permettre les valeurs 0, 0.5, les chaînes vides, et toutes les autres valeurs numériques valides
    let processedValue = value;
    
    // Pour les champs numériques, conserver les chaînes vides comme telles pour l'affichage
    if (typeof value === 'string' && value === '') {
      processedValue = ''; // Garder vide pour l'affichage
    } else if (typeof value === 'string' && !isNaN(parseFloat(value))) {
      processedValue = parseFloat(value);
    } else if (typeof value === 'number') {
      processedValue = value;
    }
    
    const newData = { ...inputData, [field]: processedValue };
    setInputData(newData);
    
    // Calcul automatique si activé
    if (autoCalculate) {
      calculateExpertAnalysis(newData);
    }
  };

  const resetAllFields = () => {
    setInputData({
      // Informations projet
      engineer_name: '',
      engineer_firstname: '',
      company_name: '',
      engineer_phone: '',
      engineer_email: '',
      
      // Paramètres hydrauliques principaux
      flow_rate: 0,
      fluid_type: 'water',
      temperature: 20, // Valeur de référence
      
      // Géométrie installation
      suction_type: 'flooded',
      suction_pipe_diameter: 0,
      discharge_pipe_diameter: 0,
      suction_height: 0,
      discharge_height: 0,
      suction_length: 0,
      discharge_length: 0,
      total_length: 0,
      
      // Pression utile
      useful_pressure: 0,
      
      // Matériaux et équipements
      suction_material: 'pvc',
      discharge_material: 'pvc',
      
      // Singularités ASPIRATION (quantités usuelles)
      suction_elbow_90: 1, // Au moins 1 coude usuel
      suction_elbow_45: 0,
      suction_elbow_30: 0,
      suction_tee_flow: 0,
      suction_tee_branch: 0,
      suction_reducer_gradual: 0,
      suction_reducer_sudden: 0,
      suction_enlarger_gradual: 0,
      suction_enlarger_sudden: 0,
      suction_gate_valve: 0,
      suction_globe_valve: 0,
      suction_ball_valve: 0,
      suction_butterfly_valve: 0,
      suction_check_valve: 0,
      suction_strainer: 1, // Crépine usuelle
      suction_foot_valve: 0,
      
      // Singularités REFOULEMENT (quantités usuelles)
      discharge_elbow_90: 2, // Coudes usuels
      discharge_elbow_45: 0,
      discharge_elbow_30: 0,
      discharge_tee_flow: 0,
      discharge_tee_branch: 0,
      discharge_reducer_gradual: 0,
      discharge_reducer_sudden: 0,
      discharge_enlarger_gradual: 0,
      discharge_enlarger_sudden: 0,
      discharge_gate_valve: 1, // Vanne d'arrêt usuelle
      discharge_globe_valve: 0,
      discharge_ball_valve: 0,
      discharge_butterfly_valve: 0,
      discharge_check_valve: 1, // Clapet anti-retour usuel
      discharge_strainer: 0,
      discharge_flow_meter: 0,
      discharge_pressure_gauge: 1, // Manomètre usuel
      
      // Paramètres électriques
      pump_efficiency: 75, // Valeur par défaut réaliste
      motor_efficiency: 85, // Valeur par défaut réaliste
      voltage: 400,
      power_factor: 0.8, // Valeur de référence
      starting_method: 'star_delta',
      cable_length: 0,
      cable_material: 'copper',
      cable_section: null,
      voltage_drop: 0, // Nouvelle valeur pour chute de tension
      
      // Paramètres avancés
      npsh_required: 0,
      installation_type: 'surface',
      pump_type: 'centrifugal',
      operating_hours: 4000, // Valeur de référence (h/an)
      electricity_cost: 96, // Prix de référence en FCFA
      
      // Conditions environnementales
      altitude: 0,
      ambient_temperature: 25, // Valeur de référence
      humidity: 60 // Valeur de référence
    });
    
    // Réinitialiser les résultats
    setResults(null);
    
    // Détruire les graphiques existants
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }
  };

  // Fonction d'export PDF avec logo ECO PUMP AFRIK
  const exportToPDF = () => {
    if (!results) {
      alert('Aucun résultat à exporter. Veuillez d\'abord effectuer un calcul.');
      return;
    }

    // Créer le contenu HTML pour le PDF avec logo et en-tête professionnel
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Rapport d'Analyse Expert - ECO PUMP AFRIK</title>
          <meta charset="UTF-8">
          <style>
            @media print {
              body { margin: 0; padding: 0; }
              .no-print { display: none; }
            }
            body { 
              font-family: 'Arial', sans-serif; 
              margin: 10mm;
              line-height: 1.4;
              color: #333;
            }
            .header { 
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-bottom: 4px solid #0ea5e9; 
              padding-bottom: 20px; 
              margin-bottom: 30px; 
              background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
              padding: 25px;
              border-radius: 12px;
            }
            .logo-section {
              display: flex;
              align-items: center;
              gap: 20px;
            }
            .logo-container {
              width: 120px;
              height: 120px;
              background: white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              border: 3px solid #0ea5e9;
            }
            .logo-svg {
              width: 80px;
              height: 80px;
            }
            .company-info {
              text-align: left;
            }
            .company-name {
              font-size: 28px;
              font-weight: bold;
              color: #0ea5e9;
              margin: 0;
              line-height: 1;
            }
            .company-subtitle {
              font-size: 14px;
              color: #0369a1;
              margin: 5px 0;
            }
            .report-title {
              text-align: center;
              margin: 15px 0;
            }
            .report-title h1 {
              color: #1e40af;
              margin: 0;
              font-size: 24px;
              font-weight: bold;
            }
            .header-details {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-top: 20px;
              padding-top: 20px;
              border-top: 2px solid #0ea5e9;
            }
            .engineer-info {
              text-align: left;
              font-size: 14px;
              flex: 1;
            }
            .date-info {
              text-align: center;
              font-size: 12px;
              color: #64748b;
              flex: 1;
            }
            .client-info {
              text-align: right;
              font-size: 14px;
              flex: 1;
            }
            .contact-info {
              background: #f8fafc;
              padding: 10px;
              border-radius: 8px;
              margin-top: 10px;
              font-size: 12px;
            }
            .section { 
              margin-bottom: 25px; 
              page-break-inside: avoid;
            }
            .section h2 { 
              color: #1e40af; 
              border-bottom: 2px solid #0ea5e9; 
              padding-bottom: 8px; 
              margin-bottom: 15px;
              font-size: 18px;
            }
            .parameter-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
              margin-bottom: 15px;
            }
            .parameter { 
              display: flex; 
              justify-content: space-between; 
              margin: 8px 0;
              padding: 8px 12px;
              background: #f8fafc;
              border-radius: 6px;
              border-left: 4px solid #e2e8f0;
            }
            .parameter strong { 
              color: #1e40af; 
              font-weight: 600;
            }
            .warning { 
              background-color: #fef3c7; 
              border: 1px solid #f59e0b; 
              padding: 15px; 
              margin: 15px 0; 
              border-radius: 8px;
              border-left: 4px solid #f59e0b;
            }
            .critical { 
              background-color: #fef2f2; 
              border: 1px solid #ef4444; 
              padding: 15px; 
              margin: 15px 0; 
              border-radius: 8px;
              border-left: 4px solid #ef4444;
            }
            .success { 
              background-color: #f0fdf4; 
              border: 1px solid #22c55e; 
              padding: 15px; 
              margin: 15px 0; 
              border-radius: 8px;
              border-left: 4px solid #22c55e;
            }
            .key-results {
              background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
              padding: 20px;
              border-radius: 12px;
              margin: 20px 0;
              border: 2px solid #0ea5e9;
            }
            .result-highlight {
              display: inline-block;
              background: #0ea5e9;
              color: white;
              padding: 6px 14px;
              border-radius: 20px;
              font-weight: bold;
              margin: 5px;
              font-size: 14px;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 3px solid #0ea5e9;
              text-align: center;
              font-size: 12px;
              color: #64748b;
              background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
              padding: 20px;
              border-radius: 8px;
            }
            .footer-logo {
              display: inline-block;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo-section">
              <div class="logo-container">
                <svg class="logo-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <!-- Logo ECO PUMP AFRIK stylisé -->
                  <defs>
                    <linearGradient id="dropGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:#0ea5e9;stop-opacity:1" />
                      <stop offset="100%" style="stop-color:#0369a1;stop-opacity:1" />
                    </linearGradient>
                  </defs>
                  
                  <!-- Goutte principale -->
                  <path d="M100 30 C130 50, 150 80, 150 110 C150 140, 125 160, 100 160 C75 160, 50 140, 50 110 C50 80, 70 50, 100 30 Z" 
                        fill="url(#dropGradient)" stroke="white" stroke-width="2"/>
                  
                  <!-- Goutte intérieure -->
                  <ellipse cx="100" cy="110" rx="25" ry="30" fill="white" opacity="0.9"/>
                  
                  <!-- Effet de mouvement -->
                  <path d="M75 170 Q100 180, 125 170 Q140 175, 155 180" 
                        stroke="#0ea5e9" stroke-width="3" fill="none" opacity="0.7"/>
                  
                  <!-- Texte stylisé -->
                  <text x="100" y="195" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#0ea5e9">
                    ECO PUMP
                  </text>
                </svg>
              </div>
              
              <div class="company-info">
                <h1 class="company-name">ECO PUMP AFRIK</h1>
                <p class="company-subtitle">Solutions de Pompage Durable</p>
                <p class="company-subtitle">Expertise Hydraulique • Conseil Technique</p>
              </div>
            </div>
            
            <div class="report-title">
              <h1>📊 RAPPORT D'ANALYSE EXPERT</h1>
              <p style="color: #0369a1; margin: 5px 0;">Système de Pompage Centrifuge</p>
            </div>
          </div>
          
          <div class="header-details">
            <div class="engineer-info">
              <strong style="color: #0ea5e9;">👤 INGÉNIEUR RESPONSABLE</strong><br>
              <strong>${inputData.engineer_firstname} ${inputData.engineer_name}</strong><br>
              <em>Spécialiste Hydraulique</em>
              <div class="contact-info">
                <div style="margin: 3px 0;">📞 ${inputData.engineer_phone || 'Non renseigné'}</div>
                <div style="margin: 3px 0;">📧 ${inputData.engineer_email || 'Non renseigné'}</div>
              </div>
            </div>
            
            <div class="date-info">
              <strong style="color: #0ea5e9;">📅 DATE D'ANALYSE</strong><br>
              <strong>${new Date().toLocaleDateString('fr-FR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</strong><br>
              ${new Date().toLocaleTimeString('fr-FR')}<br>
              <em style="margin-top: 5px; display: block;">Rapport N°: ${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}</em>
            </div>
            
            <div class="client-info">
              <strong style="color: #0ea5e9;">🏢 SOCIÉTÉ CLIENTE</strong><br>
              <strong>${inputData.company_name || 'Non renseigné'}</strong><br>
              <em>Étude de Faisabilité Technique</em>
              <div class="contact-info">
                <div style="margin: 3px 0;">📋 Analyse Hydraulique</div>
                <div style="margin: 3px 0;">⚡ Dimensionnement Électrique</div>
              </div>
            </div>
          </div>
          
          <div class="key-results">
            <h2 style="margin-top: 0; color: #0ea5e9;">🎯 RÉSULTATS CLÉS DE L'ANALYSE</h2>
            <span class="result-highlight">NPSHd: ${results.npshd_analysis?.npshd?.toFixed(2)} m</span>
            <span class="result-highlight">HMT: ${results.hmt_analysis?.hmt?.toFixed(2)} m</span>
            <span class="result-highlight">Rendement: ${results.overall_efficiency?.toFixed(1)}%</span>
            <span class="result-highlight">P. Électrique: ${results.performance_analysis?.electrical_power?.toFixed(1)} kW</span>
            <span class="result-highlight">Coût annuel: ${(results.performance_analysis?.electrical_power * 4000 * 96 / 1000).toFixed(0)} FCFA</span>
          </div>
          
          <div class="section">
            <h2>📋 PARAMÈTRES D'ENTRÉE</h2>
            <div class="parameter-grid">
              <div class="parameter"><span>Débit:</span><strong>${inputData.flow_rate} m³/h</strong></div>
              <div class="parameter"><span>Fluide:</span><strong>${fluids.find(f => f.id === inputData.fluid_type)?.name || inputData.fluid_type}</strong></div>
              <div class="parameter"><span>Température:</span><strong>${inputData.temperature}°C</strong></div>
              <div class="parameter"><span>Type d'aspiration:</span><strong>${inputData.suction_type === 'flooded' ? 'En charge' : 'Dépression'}</strong></div>
              <div class="parameter"><span>Diamètre aspiration:</span><strong>DN${dnSizes.find(d => d.mm == inputData.suction_pipe_diameter)?.dn.replace('DN', '') || inputData.suction_pipe_diameter} (${inputData.suction_pipe_diameter} mm)</strong></div>
              <div class="parameter"><span>Diamètre refoulement:</span><strong>DN${dnSizes.find(d => d.mm == inputData.discharge_pipe_diameter)?.dn.replace('DN', '') || inputData.discharge_pipe_diameter} (${inputData.discharge_pipe_diameter} mm)</strong></div>
              <div class="parameter"><span>Hauteur aspiration:</span><strong>${inputData.suction_height} m</strong></div>
              <div class="parameter"><span>Hauteur refoulement:</span><strong>${inputData.discharge_height} m</strong></div>
            </div>
          </div>

          <div class="section">
            <h2>💧 ANALYSE NPSHd</h2>
            ${results.npshd_analysis ? `
              <div class="parameter-grid">
                <div class="parameter"><span>NPSHd calculé:</span><strong>${results.npshd_analysis.npshd?.toFixed(2)} m</strong></div>
                <div class="parameter"><span>NPSH requis:</span><strong>${results.npshd_analysis.npsh_required?.toFixed(2)} m</strong></div>
                <div class="parameter"><span>Marge de sécurité:</span><strong>${results.npshd_analysis.npsh_margin?.toFixed(2)} m</strong></div>
                <div class="parameter"><span>Vitesse aspiration:</span><strong>${results.npshd_analysis.velocity?.toFixed(2)} m/s</strong></div>
                <div class="parameter"><span>Reynolds:</span><strong>${results.npshd_analysis.reynolds_number?.toFixed(0)}</strong></div>
                <div class="parameter"><span>Régime:</span><strong>${results.npshd_analysis.reynolds_number > 4000 ? 'Turbulent' : 
                          results.npshd_analysis.reynolds_number > 2300 ? 'Transitoire' : 'Laminaire'}</strong></div>
              </div>
              ${results.npshd_analysis.cavitation_risk ? 
                '<div class="critical"><strong>🚨 RISQUE DE CAVITATION DÉTECTÉ</strong><br>Action immédiate requise pour éviter la destruction de la pompe.</div>' : 
                '<div class="success"><strong>✅ AUCUN RISQUE DE CAVITATION</strong><br>La pompe fonctionnera en sécurité avec les paramètres actuels.</div>'
              }
            ` : '<p>Données NPSHd non disponibles</p>'}
          </div>

          <div class="section">
            <h2>⚡ ANALYSE HMT</h2>
            ${results.hmt_analysis ? `
              <div class="parameter-grid">
                <div class="parameter"><span>HMT totale:</span><strong>${results.hmt_analysis.hmt?.toFixed(2)} m</strong></div>
                <div class="parameter"><span>Hauteur statique:</span><strong>${results.hmt_analysis.static_head?.toFixed(2)} m</strong></div>
                <div class="parameter"><span>Pertes aspiration:</span><strong>${results.npshd_analysis?.total_head_loss?.toFixed(2)} m</strong></div>
                <div class="parameter"><span>Pertes refoulement:</span><strong>${results.hmt_analysis.total_head_loss?.toFixed(2)} m</strong></div>
                <div class="parameter"><span>Pertes totales:</span><strong>${results.total_head_loss?.toFixed(2)} m</strong></div>
                <div class="parameter"><span>Pression utile:</span><strong>${inputData.useful_pressure} bar</strong></div>
              </div>
            ` : '<p>Données HMT non disponibles</p>'}
          </div>

          <div class="section">
            <h2>🔌 PERFORMANCE ÉNERGÉTIQUE</h2>
            ${results.performance_analysis ? `
              <div class="parameter-grid">
                <div class="parameter"><span>Rendement pompe:</span><strong>${inputData.pump_efficiency}%</strong></div>
                <div class="parameter"><span>Rendement moteur:</span><strong>${inputData.motor_efficiency}%</strong></div>
                <div class="parameter"><span>Rendement global:</span><strong>${results.overall_efficiency?.toFixed(1)}%</strong></div>
                <div class="parameter"><span>Puissance hydraulique:</span><strong>${results.performance_analysis.hydraulic_power?.toFixed(2)} kW</strong></div>
                <div class="parameter"><span>Puissance électrique:</span><strong>${results.performance_analysis.electrical_power?.toFixed(2)} kW</strong></div>
                <div class="parameter"><span>Coût annuel (4000h):</span><strong>${(results.performance_analysis.electrical_power * 4000 * 96 / 1000).toFixed(0)} FCFA</strong></div>
              </div>
            ` : '<p>Données de performance non disponibles</p>'}
          </div>

          ${results.expert_recommendations && results.expert_recommendations.length > 0 ? `
            <div class="section">
              <h2>💡 RECOMMANDATIONS D'EXPERT</h2>
              ${results.expert_recommendations.slice(0, 3).map(rec => `
                <div class="${rec.type === 'critical' ? 'critical' : 'warning'}">
                  <h3 style="margin-top: 0;">${rec.title}</h3>
                  <p><strong>Description:</strong> ${rec.description}</p>
                  <p><strong>Impact:</strong> ${rec.impact}</p>
                  ${rec.solutions ? `
                    <p><strong>Solutions recommandées:</strong></p>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                      ${rec.solutions.slice(0, 3).map(sol => `<li>${sol}</li>`).join('')}
                    </ul>
                  ` : ''}
                  <p><strong>Urgence:</strong> ${rec.urgency || 'Moyenne'} • <strong>Impact coût:</strong> ${rec.cost_impact || 'À évaluer'}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <div class="footer">
            <div class="footer-logo">
              <strong style="color: #0ea5e9; font-size: 16px;">ECO PUMP AFRIK</strong>
            </div>
            <p><strong>📋 Rapport généré par:</strong> ${inputData.engineer_firstname} ${inputData.engineer_name}</p>
            <p><strong>📞 Contact:</strong> ${inputData.engineer_phone || 'Non renseigné'} • 
               <strong>📧 Email:</strong> ${inputData.engineer_email || 'Non renseigné'}</p>
            <p><strong>🏢 Client:</strong> ${inputData.company_name || 'Non renseigné'} • 
               <strong>📅 Date:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
            <p style="margin-top: 15px; font-style: italic; color: #0369a1;">
              <strong>ECO PUMP AFRIK - Solutions de Pompage Durable</strong><br>
              Expertise Hydraulique • Conseil Technique • Dimensionnement Électrique<br>
              Ce rapport a été généré automatiquement par notre système d'analyse hydraulique expert.
            </p>
          </div>
        </body>
      </html>
    `;

    // Créer un blob et télécharger le PDF
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ECO-PUMP-AFRIK-Rapport-${inputData.company_name?.replace(/\s+/g, '-') || 'Client'}-${new Date().toISOString().split('T')[0]}.html`;
    
    // Ouvrir dans un nouvel onglet pour impression PDF
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = function() {
        setTimeout(() => {
          printWindow.print();
        }, 1000);
      };
    }
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Fonction d'export Excel
  const exportToExcel = () => {
    if (!results) {
      alert('Aucun résultat à exporter. Veuillez d\'abord effectuer un calcul.');
      return;
    }

    // Créer les données CSV
    const csvData = [];
    
    // En-tête
    csvData.push(['Rapport d\'Analyse Expert - Système de Pompage']);
    csvData.push(['Généré le', new Date().toLocaleDateString('fr-FR')]);
    csvData.push([]);
    
    // Paramètres d'entrée
    csvData.push(['PARAMÈTRES D\'ENTRÉE']);
    csvData.push(['Débit (m³/h)', inputData.flow_rate]);
    csvData.push(['Fluide', inputData.fluid_type]);
    csvData.push(['Température (°C)', inputData.temperature]);
    csvData.push(['Diamètre aspiration (mm)', inputData.suction_pipe_diameter]);
    csvData.push(['Diamètre refoulement (mm)', inputData.discharge_pipe_diameter]);
    csvData.push([]);
    
    // Résultats NPSHd
    if (results.npshd_analysis) {
      csvData.push(['RÉSULTATS NPSHd']);
      csvData.push(['NPSHd calculé (m)', results.npshd_analysis.npshd?.toFixed(2)]);
      csvData.push(['NPSH requis (m)', results.npshd_analysis.npsh_required?.toFixed(2)]);
      csvData.push(['Marge de sécurité (m)', results.npshd_analysis.npsh_margin?.toFixed(2)]);
      csvData.push(['Risque de cavitation', results.npshd_analysis.cavitation_risk ? 'OUI' : 'NON']);
      csvData.push([]);
    }
    
    // Résultats HMT
    if (results.hmt_analysis) {
      csvData.push(['RÉSULTATS HMT']);
      csvData.push(['HMT calculée (m)', results.hmt_analysis.hmt?.toFixed(2)]);
      csvData.push(['Hauteur statique (m)', results.hmt_analysis.static_head?.toFixed(2)]);
      csvData.push(['Pertes de charge totales (m)', results.hmt_analysis.total_head_loss?.toFixed(2)]);
      csvData.push([]);
    }
    
    // Performance énergétique
    if (results.performance_analysis) {
      csvData.push(['PERFORMANCE ÉNERGÉTIQUE']);
      csvData.push(['Rendement global (%)', results.performance_analysis.overall_efficiency?.toFixed(1)]);
      csvData.push(['Puissance hydraulique (kW)', results.performance_analysis.hydraulic_power?.toFixed(2)]);
      csvData.push(['Puissance électrique (kW)', results.performance_analysis.electrical_power?.toFixed(2)]);
      csvData.push([]);
    }
    
    // Recommandations
    if (results.expert_recommendations && results.expert_recommendations.length > 0) {
      csvData.push(['RECOMMANDATIONS']);
      results.expert_recommendations.forEach((rec, index) => {
        csvData.push([`${index + 1}. ${rec.title}`]);
        csvData.push(['Description', rec.description]);
        csvData.push(['Impact', rec.impact]);
        csvData.push([]);
      });
    }
    
    // Convertir en CSV
    const csvContent = csvData.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
    
    // Télécharger
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `donnees-pompage-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const calculateExpertAnalysis = async (data = inputData) => {
    if (!autoCalculate && data === inputData) return;
    
    setLoading(true);
    try {
      // Convertir les valeurs vides en 0 pour les calculs (sans affecter l'affichage)
      const cleanedData = {
        ...data,
        suction_height: data.suction_height === '' ? 0 : data.suction_height,
        discharge_height: data.discharge_height === '' ? 0 : data.discharge_height,
        suction_length: data.suction_length === '' ? 0 : data.suction_length,
        discharge_length: data.discharge_length === '' ? 0 : data.discharge_length,
        npsh_required: data.npsh_required === '' ? 0 : data.npsh_required
      };
      
      const response = await axios.post(`${API}/expert-analysis`, {
        ...cleanedData,
        // Formatage des raccords
        suction_fittings: [
          { fitting_type: 'elbow_90', quantity: data.suction_elbow_90 },
          { fitting_type: 'elbow_45', quantity: data.suction_elbow_45 },
          { fitting_type: 'tee', quantity: data.suction_tee },
          { fitting_type: 'reducer', quantity: data.suction_reducer },
          { fitting_type: 'valve', quantity: data.suction_valve },
          { fitting_type: 'check_valve', quantity: data.suction_check_valve },
          { fitting_type: 'strainer', quantity: data.suction_strainer }
        ].filter(f => f.quantity > 0),
        discharge_fittings: [
          { fitting_type: 'elbow_90', quantity: data.discharge_elbow_90 },
          { fitting_type: 'elbow_45', quantity: data.discharge_elbow_45 },
          { fitting_type: 'tee', quantity: data.discharge_tee },
          { fitting_type: 'reducer', quantity: data.discharge_reducer },
          { fitting_type: 'valve', quantity: data.discharge_valve },
          { fitting_type: 'check_valve', quantity: data.discharge_check_valve }
        ].filter(f => f.quantity > 0),
        elbow_90_qty: data.suction_elbow_90 + data.discharge_elbow_90,
        elbow_45_qty: data.suction_elbow_45 + data.discharge_elbow_45,
        valve_qty: data.suction_valve + data.discharge_valve,
        check_valve_qty: data.suction_check_valve + data.discharge_check_valve
      });
      
      setResults(response.data);
      updateExpertCharts(response.data);
    } catch (error) {
      console.error('Erreur analyse expert:', error);
      // Fallback avec calculs séparés
      await calculateFallbackAnalysis(data);
    } finally {
      setLoading(false);
    }
  };

  const calculateFallbackAnalysis = async (data) => {
    try {
      // Convertir les valeurs vides en 0 pour les calculs
      const cleanedData = {
        ...data,
        suction_height: data.suction_height === '' ? 0 : data.suction_height,
        discharge_height: data.discharge_height === '' ? 0 : data.discharge_height,
        suction_length: data.suction_length === '' ? 0 : data.suction_length,
        discharge_length: data.discharge_length === '' ? 0 : data.discharge_length,
        npsh_required: data.npsh_required === '' ? 0 : data.npsh_required
      };
      
      // Calculs parallèles pour toutes les données
      const [npshResponse, hmtResponse, perfResponse] = await Promise.all([
        axios.post(`${API}/calculate-npshd`, {
          suction_type: cleanedData.suction_height > 0 ? 'flooded' : 'suction_lift',
          hasp: Math.abs(cleanedData.suction_height),
          flow_rate: cleanedData.flow_rate,
          fluid_type: cleanedData.fluid_type,
          temperature: cleanedData.temperature,
          pipe_diameter: cleanedData.suction_pipe_diameter,
          pipe_material: cleanedData.suction_material,
          pipe_length: cleanedData.suction_length,
          suction_fittings: [
            { fitting_type: 'elbow_90', quantity: cleanedData.suction_elbow_90 },
            { fitting_type: 'check_valve', quantity: cleanedData.suction_check_valve }
          ].filter(f => f.quantity > 0),
          npsh_required: cleanedData.npsh_required
        }),
        axios.post(`${API}/calculate-hmt`, {
          installation_type: cleanedData.installation_type,
          suction_type: cleanedData.suction_height > 0 ? 'flooded' : 'suction_lift',
          hasp: Math.abs(cleanedData.suction_height),
          discharge_height: cleanedData.discharge_height,
          useful_pressure: cleanedData.useful_pressure,
          suction_pipe_diameter: cleanedData.suction_pipe_diameter,
          discharge_pipe_diameter: cleanedData.discharge_pipe_diameter,
          suction_pipe_length: cleanedData.suction_length,
          discharge_pipe_length: cleanedData.discharge_length,
          suction_pipe_material: cleanedData.suction_material,
          discharge_pipe_material: cleanedData.discharge_material,
          suction_fittings: [
            { fitting_type: 'elbow_90', quantity: cleanedData.suction_elbow_90 },
            { fitting_type: 'check_valve', quantity: cleanedData.suction_check_valve }
          ].filter(f => f.quantity > 0),
          discharge_fittings: [
            { fitting_type: 'elbow_90', quantity: cleanedData.discharge_elbow_90 },
            { fitting_type: 'valve', quantity: cleanedData.discharge_valve }
          ].filter(f => f.quantity > 0),
          fluid_type: cleanedData.fluid_type,
          temperature: cleanedData.temperature,
          flow_rate: cleanedData.flow_rate
        }),
        axios.post(`${API}/calculate-performance`, {
          flow_rate: cleanedData.flow_rate,
          hmt: 30, // Estimation temporaire
          pipe_diameter: cleanedData.suction_pipe_diameter,
          fluid_type: cleanedData.fluid_type,
          pipe_material: cleanedData.suction_material,
          pump_efficiency: cleanedData.pump_efficiency,
          motor_efficiency: cleanedData.motor_efficiency,
          starting_method: cleanedData.starting_method,
          power_factor: cleanedData.power_factor,
          cable_length: cleanedData.cable_length,
          cable_material: cleanedData.cable_material,
          voltage: cleanedData.voltage
        })
      ]);

      // Calculs avancés d'expert
      const hydraulicPower = ((cleanedData.flow_rate * hmtResponse.data.hmt) / (cleanedData.pump_efficiency * 367)) * 100;
      const electricalPower = hydraulicPower / (cleanedData.motor_efficiency / 100);
      const overallEfficiency = (cleanedData.pump_efficiency / 100) * (cleanedData.motor_efficiency / 100) * 100;
      const annualEnergyCost = (electricalPower * cleanedData.operating_hours * cleanedData.electricity_cost) / 1000;
      
      // Combinaison des résultats
      const combinedResults = {
        npshd_analysis: {
          npshd: npshResponse.data.npshd,
          npsh_required: npshResponse.data.npsh_required,
          npsh_margin: npshResponse.data.npsh_margin,
          cavitation_risk: npshResponse.data.cavitation_risk,
          velocity: npshResponse.data.velocity,
          reynolds_number: npshResponse.data.reynolds_number,
          total_head_loss: npshResponse.data.total_head_loss,
          warnings: npshResponse.data.warnings,
          recommendations: npshResponse.data.recommendations
        },
        hmt_analysis: {
          hmt: hmtResponse.data.hmt,
          static_head: hmtResponse.data.static_head,
          total_head_loss: hmtResponse.data.total_head_loss,
          suction_velocity: hmtResponse.data.suction_velocity,
          discharge_velocity: hmtResponse.data.discharge_velocity,
          useful_pressure_head: hmtResponse.data.useful_pressure_head,
          warnings: hmtResponse.data.warnings
        },
        performance_analysis: {
          overall_efficiency: overallEfficiency,
          pump_efficiency: data.pump_efficiency,
          motor_efficiency: data.motor_efficiency,
          hydraulic_power: hydraulicPower,
          electrical_power: electricalPower,
          nominal_current: perfResponse.data.nominal_current,
          starting_current: perfResponse.data.starting_current,
          power_calculations: perfResponse.data.power_calculations,
          warnings: perfResponse.data.warnings,
          alerts: perfResponse.data.alerts
        },
        electrical_analysis: {
          voltage: data.voltage,
          power_factor: data.power_factor,
          starting_method: data.starting_method,
          cable_length: data.cable_length,
          cable_section: perfResponse.data.recommended_cable_section,
          annual_energy_cost: annualEnergyCost,
          daily_energy_cost: annualEnergyCost / 365,
          energy_consumption_per_m3: electricalPower / data.flow_rate
        },
        overall_efficiency: overallEfficiency,
        total_head_loss: (npshResponse.data.total_head_loss || 0) + (hmtResponse.data.total_head_loss || 0),
        system_stability: !npshResponse.data.cavitation_risk && overallEfficiency > 60,
        energy_consumption: electricalPower / data.flow_rate,
        expert_recommendations: generateExpertRecommendations(data, npshResponse.data, hmtResponse.data, perfResponse.data),
        optimization_potential: {
          energy_savings: Math.max(0, 80 - overallEfficiency),
          npsh_margin: npshResponse.data.npsh_margin,
          velocity_optimization: Math.max(0, npshResponse.data.velocity - 2.0),
          head_loss_reduction: Math.max(0, (npshResponse.data.total_head_loss + hmtResponse.data.total_head_loss) * 0.3)
        },
        performance_curves: perfResponse.data.performance_curves || {},
        system_curves: {
          flow_points: Array.from({length: 20}, (_, i) => i * 5),
          system_curve: Array.from({length: 20}, (_, i) => (i * 5)**2 * 0.01),
          operating_point: {
            flow: data.flow_rate,
            head: hmtResponse.data.hmt,
            efficiency: overallEfficiency,
            power: electricalPower
          }
        }
      };

      setResults(combinedResults);
      updateExpertCharts(combinedResults);
    } catch (error) {
      console.error('Erreur calculs fallback:', error);
    }
  };

  const generateExpertRecommendations = (input, npshd, hmt, perf) => {
    const recommendations = [];
    
    // Analyse critique de cavitation
    if (npshd.cavitation_risk) {
      recommendations.push({
        type: 'critical',
        priority: 1,
        title: '🚨 CAVITATION CRITIQUE',
        description: `NPSHd (${npshd.npshd.toFixed(2)}m) ≤ NPSH requis (${input.npsh_required.toFixed(2)}m)`,
        impact: 'DESTRUCTION DE LA POMPE - Arrêt immédiat requis',
        solutions: [
          `Réduire hauteur d'aspiration de ${Math.abs(input.suction_height).toFixed(1)}m à ${Math.max(0, Math.abs(input.suction_height) - Math.abs(npshd.npsh_margin) - 0.5).toFixed(1)}m`,
          `Augmenter diamètre aspiration de ${input.suction_pipe_diameter}mm à ${Math.ceil(input.suction_pipe_diameter * 1.3)}mm`,
          `Réduire longueur aspiration de ${input.suction_length}m à ${Math.max(5, input.suction_length * 0.7).toFixed(1)}m`,
          'Supprimer raccords non essentiels sur aspiration',
          'Installer pompe en charge si possible'
        ],
        urgency: 'IMMÉDIATE',
        cost_impact: 'ÉLEVÉ'
      });
    }
    
    // Analyse de performance énergétique
    const efficiency = (input.pump_efficiency / 100) * (input.motor_efficiency / 100) * 100;
    if (efficiency < 65) {
      const potential_savings = (75 - efficiency) * 0.01 * input.operating_hours * input.electricity_cost;
      recommendations.push({
        type: 'energy',
        priority: 2,
        title: '⚡ EFFICACITÉ ÉNERGÉTIQUE FAIBLE',
        description: `Rendement global ${efficiency.toFixed(1)}% - Potentiel d'économie de ${potential_savings.toFixed(0)}€/an`,
        impact: `Surconsommation: ${(potential_savings * 10).toFixed(0)}€ sur 10 ans`,
        solutions: [
          'Pompe haute efficacité (gain 5-10%)',
          'Moteur haut rendement Premium (gain 2-5%)',
          'Variateur de vitesse (gain 10-30%)',
          'Optimisation point de fonctionnement',
          'Maintenance préventive régulière'
        ],
        urgency: 'MOYENNE',
        cost_impact: 'RENTABLE'
      });
    }
    
    // Analyse hydraulique avancée
    if (npshd.velocity > 3.0) {
      recommendations.push({
        type: 'hydraulic',
        priority: 3,
        title: '🌊 VITESSE EXCESSIVE',
        description: `Vitesse ${npshd.velocity.toFixed(2)}m/s > 3m/s - Risque d'érosion et cavitation`,
        impact: 'Usure prématurée, bruit, vibrations, perte de performance',
        solutions: [
          `Diamètre aspiration: ${input.suction_pipe_diameter}mm → ${Math.ceil(input.suction_pipe_diameter * Math.sqrt(npshd.velocity / 2.5))}mm`,
          `Diamètre refoulement: ${input.discharge_pipe_diameter}mm → ${Math.ceil(input.discharge_pipe_diameter * Math.sqrt(npshd.velocity / 3.0))}mm`,
          'Matériaux anti-érosion (inox, fonte)',
          'Supports anti-vibratoires',
          'Réduction débit si possible'
        ],
        urgency: 'MOYENNE',
        cost_impact: 'MODÉRÉ'
      });
    }
    
    // Analyse électrique
    if (perf.starting_current > 150) {
      recommendations.push({
        type: 'electrical',
        priority: 4,
        title: '🔌 COURANT DE DÉMARRAGE ÉLEVÉ',
        description: `Courant démarrage ${perf.starting_current.toFixed(1)}A - Impact réseau`,
        impact: 'Chutes de tension, perturbations réseau, contraintes transformateur',
        solutions: [
          'Démarreur progressif (réduction 50-70%)',
          'Variateur de vitesse (réduction 80%)',
          'Démarrage étoile-triangle (réduction 33%)',
          'Renforcement alimentation électrique',
          'Compensation d\'énergie réactive'
        ],
        urgency: 'FAIBLE',
        cost_impact: 'VARIABLE'
      });
    }
    
    // Analyse de fiabilité
    const total_singularities = Object.keys(input).filter(k => k.includes('_elbow_') || k.includes('_valve') || k.includes('_tee')).reduce((sum, key) => sum + (input[key] || 0), 0);
    if (total_singularities > 8) {
      recommendations.push({
        type: 'reliability',
        priority: 5,
        title: '🔧 COMPLEXITÉ EXCESSIVE',
        description: `${total_singularities} singularités - Risque de pannes multiples`,
        impact: 'Maintenance accrue, points de défaillance multiples, pertes de charge',
        solutions: [
          'Simplification du circuit hydraulique',
          'Réduction nombre de raccords',
          'Tuyauterie rectiligne privilégiée',
          'Raccords haute qualité',
          'Plan de maintenance préventive'
        ],
        urgency: 'FAIBLE',
        cost_impact: 'LONG TERME'
      });
    }
    
    return recommendations;
  };

  const updateExpertCharts = (data) => {
    if (!chartRef.current || !data.performance_curves) return;

    const ctx = chartRef.current.getContext('2d');
    
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const curves = data.performance_curves;
    const systemCurve = data.system_curves;
    
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: curves.flow || systemCurve.flow_points,
        datasets: [
          {
            label: 'Courbe HMT Pompe',
            data: curves.hmt || [],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
            pointRadius: 0,
            pointHoverRadius: 8,
            tension: 0.4,
            fill: false,
            yAxisID: 'y'
          },
          {
            label: 'Courbe Système',
            data: systemCurve.system_curve || [],
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 3,
            pointRadius: 0,
            pointHoverRadius: 8,
            tension: 0.4,
            fill: false,
            yAxisID: 'y'
          },
          {
            label: 'Rendement Pompe',
            data: curves.efficiency || [],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 8,
            tension: 0.4,
            fill: false,
            yAxisID: 'y1'
          },
          {
            label: 'Puissance Absorbée',
            data: curves.power || [],
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 8,
            tension: 0.4,
            fill: false,
            yAxisID: 'y2'
          },
          {
            label: 'Point de Fonctionnement',
            data: [{
              x: systemCurve.operating_point?.flow || inputData.flow_rate,
              y: systemCurve.operating_point?.head || 0
            }],
            borderColor: '#000000',
            backgroundColor: '#000000',
            borderWidth: 4,
            pointRadius: 12,
            pointHoverRadius: 16,
            showLine: false,
            yAxisID: 'y'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Débit (m³/h)',
              font: { size: 14, weight: 'bold' }
            },
            grid: { color: 'rgba(0, 0, 0, 0.1)' }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'HMT (m)',
              font: { size: 14, weight: 'bold' }
            },
            grid: { color: 'rgba(0, 0, 0, 0.1)' }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Rendement (%)',
              font: { size: 14, weight: 'bold' }
            },
            min: 0,
            max: 100,
            grid: { drawOnChartArea: false }
          },
          y2: {
            type: 'linear',
            display: false,
            position: 'right',
            title: {
              display: true,
              text: 'Puissance (kW)',
              font: { size: 14, weight: 'bold' }
            },
            grid: { drawOnChartArea: false }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: { size: 12, weight: 'bold' },
              usePointStyle: true
            }
          },
          title: {
            display: true,
            text: 'Analyse Experte - Courbes de Performance et Système',
            font: { size: 16, weight: 'bold' }
          }
        }
      }
    });
  };

  // Calcul initial
  React.useEffect(() => {
    if (autoCalculate) {
      calculateExpertAnalysis();
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Expert */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-2">🧠 ANALYSE HYDRAULIQUE EXPERTE</h2>
        <p className="text-purple-100 mb-4">
          Calculs avancés temps réel • Diagnostics automatiques • Recommandations professionnelles
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoCalculate}
                onChange={(e) => setAutoCalculate(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium">Calcul automatique</span>
            </label>
            {!autoCalculate && (
              <button
                onClick={() => calculateExpertAnalysis()}
                className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors"
                disabled={loading}
              >
                {loading ? 'Calcul...' : 'Calculer'}
              </button>
            )}
            
            {/* Bouton de remise à zéro */}
            <button
              onClick={resetAllFields}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center space-x-2"
              title="Remettre à zéro tous les champs"
            >
              <span>🔄</span>
              <span>Réinitialiser</span>
            </button>
            
            {/* Bouton Export PDF */}
            <button
              onClick={() => exportToPDF()}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center space-x-2"
              title="Exporter en PDF"
              disabled={!results}
            >
              <span>📄</span>
              <span>PDF</span>
            </button>
            
            {/* Bouton Export Excel */}
            <button
              onClick={() => exportToExcel()}
              className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center space-x-2"
              title="Exporter en Excel"
              disabled={!results}
            >
              <span>📊</span>
              <span>Excel</span>
            </button>
          </div>
          
          <div className="flex space-x-2">
            {['all', 'hydraulic', 'electrical', 'analysis'].map(section => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === section 
                    ? 'bg-white text-purple-600' 
                    : 'bg-purple-500 text-white hover:bg-purple-400'
                }`}
              >
                {section === 'all' ? 'Tout' : 
                 section === 'hydraulic' ? 'Hydraulique' : 
                 section === 'electrical' ? 'Électrique' : 'Analyse'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Panneau de saisie - Colonne 1 */}
        <div className="xl:col-span-1 space-y-6">
          {/* Informations du projet */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-indigo-600 flex items-center">
              👤 Informations du Projet
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={inputData.engineer_name || ''}
                    onChange={(e) => handleInputChange('engineer_name', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Nom de l'ingénieur"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={inputData.engineer_firstname || ''}
                    onChange={(e) => handleInputChange('engineer_firstname', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Prénom de l'ingénieur"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Société cliente
                </label>
                <input
                  type="text"
                  value={inputData.company_name || ''}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Nom de la société cliente"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    📞 Téléphone
                  </label>
                  <input
                    type="tel"
                    value={inputData.engineer_phone || ''}
                    onChange={(e) => handleInputChange('engineer_phone', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="+226 XX XX XX XX"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    📧 Email
                  </label>
                  <input
                    type="email"
                    value={inputData.engineer_email || ''}
                    onChange={(e) => handleInputChange('engineer_email', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="ingenieur@ecopump.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Paramètres hydrauliques */}
          {(activeSection === 'all' || activeSection === 'hydraulic') && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-600 flex items-center">
                💧 Paramètres Hydrauliques
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ⭐ Débit (m³/h)
                    </label>
                    <input
                      type="number"
                      value={inputData.flow_rate || ''}
                      onChange={(e) => handleInputChange('flow_rate', parseFloat(e.target.value) || 0)}
                      className="w-full p-2 border-2 border-yellow-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-yellow-50"
                      placeholder="Saisissez le débit"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ⭐ Température (°C)
                    </label>
                    <input
                      type="number"
                      value={inputData.temperature || ''}
                      onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value) || 0)}
                      className="w-full p-2 border-2 border-yellow-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-yellow-50"
                      placeholder="Température du fluide"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fluide
                  </label>
                  <select
                    value={inputData.fluid_type}
                    onChange={(e) => handleInputChange('fluid_type', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {fluids.map(fluid => (
                      <option key={fluid.id} value={fluid.id}>{fluid.name}</option>
                    ))}
                  </select>
                </div>
                
                {/* Propriétés du fluide affichées automatiquement */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                    🧪 Propriétés du Fluide à {inputData.temperature}°C
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-3 rounded border">
                      <div className="font-medium text-gray-700">Masse Volumique</div>
                      <div className="text-lg font-bold text-blue-600">
                        {(() => {
                          // Utiliser la nouvelle fonction universelle
                          const fluidProps = calculateFluidProperties(inputData.fluid_type, inputData.temperature);
                          return fluidProps.density.toFixed(1);
                        })()}
                      </div>
                      <div className="text-xs text-gray-500">kg/m³</div>
                    </div>
                    
                    <div className="bg-white p-3 rounded border">
                      <div className="font-medium text-gray-700">Viscosité</div>
                      <div className="text-lg font-bold text-green-600">
                        {(() => {
                          // Utiliser la nouvelle fonction universelle
                          const fluidProps = calculateFluidProperties(inputData.fluid_type, inputData.temperature);
                          return fluidProps.viscosity.toFixed(4);
                        })()}
                      </div>
                      <div className="text-xs text-gray-500">Pa·s</div>
                    </div>
                    
                    <div className="bg-white p-3 rounded border">
                      <div className="font-medium text-gray-700">Pression Vapeur</div>
                      <div className="text-lg font-bold text-red-600">
                        {(() => {
                          // Utiliser la nouvelle fonction universelle
                          const fluidProps = calculateFluidProperties(inputData.fluid_type, inputData.temperature);
                          return fluidProps.vapor_pressure.toFixed(0);
                        })()}
                      </div>
                      <div className="text-xs text-gray-500">Pa</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type d'Aspiration
                  </label>
                  <select
                    value={inputData.suction_type}
                    onChange={(e) => handleInputChange('suction_type', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="flooded">Aspiration en charge</option>
                    <option value="suction_lift">Aspiration en dépression</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ⭐ Hauteur Asp. (m)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={inputData.suction_height !== undefined && inputData.suction_height !== null ? inputData.suction_height : ''}
                      onChange={(e) => handleInputChange('suction_height', e.target.value === '' ? '' : parseFloat(e.target.value))}
                      className="w-full p-2 border-2 border-yellow-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-yellow-50"
                      placeholder="Hauteur d'aspiration"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {inputData.suction_type === 'flooded' ? 'En charge (positif)' : 'Dépression (hauteur)'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ⭐ Hauteur Ref. (m)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={inputData.discharge_height !== undefined && inputData.discharge_height !== null ? inputData.discharge_height : ''}
                      onChange={(e) => handleInputChange('discharge_height', e.target.value === '' ? '' : parseFloat(e.target.value))}
                      className="w-full p-2 border-2 border-yellow-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-yellow-50"
                      placeholder="Hauteur de refoulement"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pression Utile (bar)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={inputData.useful_pressure || ''}
                    onChange={(e) => handleInputChange('useful_pressure', parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Pression supplémentaire"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Pression supplémentaire requise (processus, pression résiduelle)
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ⭐ ⌀ Aspiration (DN)
                    </label>
                    <select
                      value={inputData.suction_pipe_diameter || ''}
                      onChange={(e) => handleInputChange('suction_pipe_diameter', parseFloat(e.target.value) || 0)}
                      className="w-full p-2 border-2 border-yellow-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-yellow-50"
                    >
                      <option value="">Sélectionnez un diamètre</option>
                      {dnSizes.map(size => (
                        <option key={size.mm} value={size.mm}>{size.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ⭐ ⌀ Refoulement (DN)
                    </label>
                    <select
                      value={inputData.discharge_pipe_diameter || ''}
                      onChange={(e) => handleInputChange('discharge_pipe_diameter', parseFloat(e.target.value) || 0)}
                      className="w-full p-2 border-2 border-yellow-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-yellow-50"
                    >
                      <option value="">Sélectionnez un diamètre</option>
                      {dnSizes.map(size => (
                        <option key={size.mm} value={size.mm}>{size.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Long. Asp. (m)
                    </label>
                    <input
                      type="number"
                      value={inputData.suction_length !== undefined && inputData.suction_length !== null ? inputData.suction_length : ''}
                      onChange={(e) => handleInputChange('suction_length', e.target.value === '' ? '' : parseFloat(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Longueur aspiration"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Long. Ref. (m)
                    </label>
                    <input
                      type="number"
                      value={inputData.discharge_length !== undefined && inputData.discharge_length !== null ? inputData.discharge_length : ''}
                      onChange={(e) => handleInputChange('discharge_length', e.target.value === '' ? '' : parseFloat(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Longueur refoulement"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Matériau Asp.
                    </label>
                    <select
                      value={inputData.suction_material}
                      onChange={(e) => handleInputChange('suction_material', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {pipeMaterials.map(material => (
                        <option key={material.id} value={material.id}>{material.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Matériau Ref.
                    </label>
                    <select
                      value={inputData.discharge_material}
                      onChange={(e) => handleInputChange('discharge_material', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {pipeMaterials.map(material => (
                        <option key={material.id} value={material.id}>{material.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ⭐ NPSH Requis (m)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={inputData.npsh_required !== undefined && inputData.npsh_required !== null ? inputData.npsh_required : ''}
                    onChange={(e) => handleInputChange('npsh_required', e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full p-2 border-2 border-yellow-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-yellow-50"
                    placeholder="NPSH requis de la pompe"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Singularités Complètes */}
          {(activeSection === 'all' || activeSection === 'hydraulic') && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-orange-600 flex items-center">
                🔧 Singularités Complètes
              </h3>
              <div className="space-y-4">
                <div className="text-sm font-medium text-gray-700 mb-3 bg-blue-50 p-3 rounded-lg">
                  💧 ASPIRATION (Attention : impact critique sur NPSHd)
                </div>
                
                {/* Coudes aspiration */}
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Coudes 90°</label>
                    <input
                      type="number"
                      min="0"
                      value={inputData.suction_elbow_90}
                      onChange={(e) => handleInputChange('suction_elbow_90', parseInt(e.target.value) || 0)}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Coudes 45°</label>
                    <input
                      type="number"
                      min="0"
                      value={inputData.suction_elbow_45}
                      onChange={(e) => handleInputChange('suction_elbow_45', parseInt(e.target.value) || 0)}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Coudes 30°</label>
                    <input
                      type="number"
                      min="0"
                      value={inputData.suction_elbow_30}
                      onChange={(e) => handleInputChange('suction_elbow_30', parseInt(e.target.value) || 0)}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Crépine</label>
                    <input
                      type="number"
                      min="0"
                      value={inputData.suction_strainer}
                      onChange={(e) => handleInputChange('suction_strainer', parseInt(e.target.value) || 0)}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                {/* Tés et raccords aspiration */}
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Té (passage)</label>
                    <input
                      type="number"
                      min="0"
                      value={inputData.suction_tee_flow}
                      onChange={(e) => handleInputChange('suction_tee_flow', parseInt(e.target.value) || 0)}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Té (dérivation)</label>
                    <input
                      type="number"
                      min="0"
                      value={inputData.suction_tee_branch}
                      onChange={(e) => handleInputChange('suction_tee_branch', parseInt(e.target.value) || 0)}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Réduction grad.</label>
                    <input
                      type="number"
                      min="0"
                      value={inputData.suction_reducer_gradual}
                      onChange={(e) => handleInputChange('suction_reducer_gradual', parseInt(e.target.value) || 0)}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Réduction brusque</label>
                    <input
                      type="number"
                      min="0"
                      value={inputData.suction_reducer_sudden}
                      onChange={(e) => handleInputChange('suction_reducer_sudden', parseInt(e.target.value) || 0)}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                {/* Vannes aspiration */}
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">V. à opercule</label>
                    <input
                      type="number"
                      min="0"
                      value={inputData.suction_gate_valve}
                      onChange={(e) => handleInputChange('suction_gate_valve', parseInt(e.target.value) || 0)}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">V. à boisseau</label>
                    <input
                      type="number"
                      min="0"
                      value={inputData.suction_ball_valve}
                      onChange={(e) => handleInputChange('suction_ball_valve', parseInt(e.target.value) || 0)}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Clapet A.R.</label>
                    <input
                      type="number"
                      min="0"
                      value={inputData.suction_check_valve}
                      onChange={(e) => handleInputChange('suction_check_valve', parseInt(e.target.value) || 0)}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Clapet de pied</label>
                    <input
                      type="number"
                      min="0"
                      value={inputData.suction_foot_valve}
                      onChange={(e) => handleInputChange('suction_foot_valve', parseInt(e.target.value) || 0)}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="text-sm font-medium text-gray-700 mb-3 bg-green-50 p-3 rounded-lg">
                  🔄 REFOULEMENT (Impact sur HMT total)
                </div>
                
                {/* Coudes refoulement */}
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Coudes 90°</label>
                    <input
                      type="number"
                      min="0"
                      value={inputData.discharge_elbow_90}
                      onChange={(e) => handleInputChange('discharge_elbow_90', parseInt(e.target.value) || 0)}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Coudes 45°</label>
                    <input
                      type="number"
                      min="0"
                      value={inputData.discharge_elbow_45}
                      onChange={(e) => handleInputChange('discharge_elbow_45', parseInt(e.target.value) || 0)}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Coudes 30°</label>
                    <input
                      type="number"
                      min="0"
                      value={inputData.discharge_elbow_30}
                      onChange={(e) => handleInputChange('discharge_elbow_30', parseInt(e.target.value) || 0)}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Té (passage)</label>
                    <input
                      type="number"
                      min="0"
                      value={inputData.discharge_tee_flow}
                      onChange={(e) => handleInputChange('discharge_tee_flow', parseInt(e.target.value) || 0)}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                {/* Vannes refoulement */}
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">V. à opercule</label>
                    <input
                      type="number"
                      min="0"
                      value={inputData.discharge_gate_valve}
                      onChange={(e) => handleInputChange('discharge_gate_valve', parseInt(e.target.value) || 0)}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">V. à boisseau</label>
                    <input
                      type="number"
                      min="0"
                      value={inputData.discharge_ball_valve}
                      onChange={(e) => handleInputChange('discharge_ball_valve', parseInt(e.target.value) || 0)}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">V. papillon</label>
                    <input
                      type="number"
                      min="0"
                      value={inputData.discharge_butterfly_valve}
                      onChange={(e) => handleInputChange('discharge_butterfly_valve', parseInt(e.target.value) || 0)}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Clapet A.R.</label>
                    <input
                      type="number"
                      min="0"
                      value={inputData.discharge_check_valve}
                      onChange={(e) => handleInputChange('discharge_check_valve', parseInt(e.target.value) || 0)}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                {/* Accessoires refoulement */}
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Réduction grad.</label>
                    <input
                      type="number"
                      min="0"
                      value={inputData.discharge_reducer_gradual}
                      onChange={(e) => handleInputChange('discharge_reducer_gradual', parseInt(e.target.value) || 0)}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Débitmètre</label>
                    <input
                      type="number"
                      min="0"
                      value={inputData.discharge_flow_meter}
                      onChange={(e) => handleInputChange('discharge_flow_meter', parseInt(e.target.value) || 0)}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Manomètre</label>
                    <input
                      type="number"
                      min="0"
                      value={inputData.discharge_pressure_gauge}
                      onChange={(e) => handleInputChange('discharge_pressure_gauge', parseInt(e.target.value) || 0)}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Filtre</label>
                    <input
                      type="number"
                      min="0"
                      value={inputData.discharge_strainer}
                      onChange={(e) => handleInputChange('discharge_strainer', parseInt(e.target.value) || 0)}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                {/* Indicateur de pertes de charge */}
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                  <p className="text-xs text-amber-800">
                    <strong>💡 Conseil Expert :</strong> Chaque singularité augmente les pertes de charge. 
                    Limitez les raccords sur l'aspiration pour préserver le NPSHd.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Paramètres électriques */}
          {(activeSection === 'all' || activeSection === 'electrical') && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-yellow-600 flex items-center">
                ⚡ Paramètres Électriques
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ⭐ Rendement Pompe (%)
                    </label>
                    <input
                      type="number"
                      min="40"
                      max="95"
                      value={inputData.pump_efficiency || ''}
                      onChange={(e) => handleInputChange('pump_efficiency', parseFloat(e.target.value) || 0)}
                      className="w-full p-2 border-2 border-yellow-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-yellow-50"
                      placeholder="75"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ⭐ Rendement Moteur (%)
                    </label>
                    <input
                      type="number"
                      min="70"
                      max="98"
                      value={inputData.motor_efficiency || ''}
                      onChange={(e) => handleInputChange('motor_efficiency', parseFloat(e.target.value) || 0)}
                      className="w-full p-2 border-2 border-yellow-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-yellow-50"
                      placeholder="85"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tension (V)
                    </label>
                    <select
                      value={inputData.voltage}
                      onChange={(e) => handleInputChange('voltage', parseInt(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={230}>230V (Monophasé)</option>
                      <option value={400}>400V (Triphasé)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cos φ
                    </label>
                    <input
                      type="number"
                      min="0.6"
                      max="1"
                      step="0.01"
                      value={inputData.power_factor}
                      onChange={(e) => handleInputChange('power_factor', parseFloat(e.target.value) || 0)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Démarrage
                  </label>
                  <select
                    value={inputData.starting_method}
                    onChange={(e) => handleInputChange('starting_method', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="star_delta">Étoile-Triangle</option>
                    <option value="direct_on_line">Direct</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Longueur Câble (m)
                    </label>
                    <input
                      type="number"
                      value={inputData.cable_length || ''}
                      onChange={(e) => handleInputChange('cable_length', parseFloat(e.target.value) || 0)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Longueur du câble"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Matériau Câble
                    </label>
                    <select
                      value={inputData.cable_material}
                      onChange={(e) => handleInputChange('cable_material', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="copper">Cuivre</option>
                      <option value="aluminum">Aluminium</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chute de Tension (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={inputData.voltage_drop || ''}
                    onChange={(e) => handleInputChange('voltage_drop', parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="3"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Chute de tension admissible en % (généralement 3% max pour moteurs)
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fonctionnement (h/an)
                    </label>
                    <input
                      type="number"
                      value={inputData.operating_hours || ''}
                      onChange={(e) => handleInputChange('operating_hours', parseFloat(e.target.value) || 0)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Heures de fonctionnement annuel"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix kWh (FCFA)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={inputData.electricity_cost || ''}
                      onChange={(e) => handleInputChange('electricity_cost', parseFloat(e.target.value) || 0)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Prix du kWh en FCFA"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Prix unitaire de l'électricité (tarif industriel/domestique)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Panneau de résultats et graphiques - Colonnes 2 et 3 */}
        <div className="xl:col-span-2 space-y-6">
          {loading && (
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-gray-600 mt-4 font-medium">Analyse en cours...</p>
            </div>
          )}
          
          {/* Résultats instantanés */}
          {results && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-green-600 flex items-center">
                📊 Résultats Temps Réel
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {results.npshd_analysis?.npshd?.toFixed(2) || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">NPSHd (m)</div>
                  <div className={`text-xs mt-1 ${results.npshd_analysis?.cavitation_risk ? 'text-red-600' : 'text-green-600'}`}>
                    {results.npshd_analysis?.cavitation_risk ? '⚠️ Risque' : '✅ Sûr'}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {results.hmt_analysis?.hmt?.toFixed(2) || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">HMT (m)</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Statique: {results.hmt_analysis?.static_head?.toFixed(1) || 'N/A'}m
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {results.overall_efficiency?.toFixed(1) || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">Rendement (%)</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Global: {results.performance_analysis?.pump_efficiency?.toFixed(0) || 'N/A'} × {results.performance_analysis?.motor_efficiency?.toFixed(0) || 'N/A'}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {results.npshd_analysis?.velocity?.toFixed(2) || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">Vitesse (m/s)</div>
                  <div className={`text-xs mt-1 ${(results.npshd_analysis?.velocity || 0) > 3 ? 'text-red-600' : 'text-green-600'}`}>
                    {(results.npshd_analysis?.velocity || 0) > 3 ? '⚠️ Élevée' : '✅ Normale'}
                  </div>
                </div>
              </div>
              
              {/* Section Données Hydrauliques Principales avec valeurs mises en évidence */}
              <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-4 flex items-center">
                  💧 Résultats Hydrauliques Principaux
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* DÉBIT - Valeur mise en évidence */}
                  <div className="text-center">
                    <div className="bg-white p-4 rounded-lg border-4 border-blue-500 shadow-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {inputData.flow_rate?.toFixed(1) || 'N/A'}
                      </div>
                      <div className="text-sm font-medium text-blue-800">DÉBIT</div>
                      <div className="text-xs text-gray-600">m³/h</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {((inputData.flow_rate || 0) / 3.6).toFixed(3)} m³/s
                      </div>
                    </div>
                  </div>
                  
                  {/* HMT - Valeur mise en évidence */}
                  <div className="text-center">
                    <div className="bg-white p-4 rounded-lg border-4 border-green-500 shadow-lg">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {results.hmt_analysis?.hmt?.toFixed(1) || 'N/A'}
                      </div>
                      <div className="text-sm font-medium text-green-800">HMT</div>
                      <div className="text-xs text-gray-600">m</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Hauteur Manométrique
                      </div>
                    </div>
                  </div>
                  
                  {/* P2 - Valeur mise en évidence */}
                  <div className="text-center">
                    <div className="bg-white p-4 rounded-lg border-4 border-orange-500 shadow-lg">
                      <div className="text-2xl font-bold text-orange-600 mb-1">
                        {results.performance_analysis?.hydraulic_power?.toFixed(1) || 'N/A'}
                      </div>
                      <div className="text-sm font-medium text-orange-800">P2</div>
                      <div className="text-xs text-gray-600">kW</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Puissance Hydraulique
                      </div>
                    </div>
                  </div>
                  
                  {/* COURANT NOMINAL - Valeur mise en évidence */}
                  <div className="text-center">
                    <div className="bg-white p-4 rounded-lg border-4 border-purple-500 shadow-lg">
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        {results.performance_analysis?.nominal_current?.toFixed(1) || 'N/A'}
                      </div>
                      <div className="text-sm font-medium text-purple-800">COURANT</div>
                      <div className="text-xs text-gray-600">A</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Courant Nominal
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Ligne supplémentaire pour autres résultats importants */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-blue-200">
                  <div className="text-center">
                    <div className="bg-white p-3 rounded-lg border-2 border-red-300 shadow">
                      <div className="text-lg font-bold text-red-600">
                        {results.total_head_loss?.toFixed(2) || 'N/A'}
                      </div>
                      <div className="text-sm text-red-800">Pertes Totales</div>
                      <div className="text-xs text-gray-500">m</div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-white p-3 rounded-lg border-2 border-indigo-300 shadow">
                      <div className="text-lg font-bold text-indigo-600">
                        {results.npshd_analysis?.reynolds_number ? (
                          results.npshd_analysis.reynolds_number > 4000 ? 'Turbulent' : 
                          results.npshd_analysis.reynolds_number > 2300 ? 'Transitoire' : 'Laminaire'
                        ) : 'N/A'}
                      </div>
                      <div className="text-sm text-indigo-800">Régime</div>
                      <div className="text-xs text-gray-500">
                        Re: {results.npshd_analysis?.reynolds_number?.toFixed(0) || 'N/A'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-white p-3 rounded-lg border-2 border-cyan-300 shadow">
                      <div className="text-lg font-bold text-cyan-600">
                        {inputData.useful_pressure?.toFixed(1) || '0.0'}
                      </div>
                      <div className="text-sm text-cyan-800">Pression Utile</div>
                      <div className="text-xs text-gray-500">bar</div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-white p-3 rounded-lg border-2 border-teal-300 shadow">
                      <div className="text-lg font-bold text-teal-600">
                        {results.overall_efficiency?.toFixed(1) || 'N/A'}
                      </div>
                      <div className="text-sm text-teal-800">Rendement Global</div>
                      <div className="text-xs text-gray-500">%</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Ligne de résultats électriques */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-lg font-bold text-indigo-600">
                    {results.performance_analysis?.hydraulic_power?.toFixed(1) || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">P2 (kW)</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Hydraulique
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600">
                    {results.performance_analysis?.electrical_power?.toFixed(1) || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">P1 (kW)</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Électrique
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-600">
                    {results.performance_analysis?.nominal_current?.toFixed(1) || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">Courant (A)</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Nominal
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {results.electrical_analysis?.annual_energy_cost?.toFixed(0) || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">Coût/an (€)</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {inputData.electricity_cost?.toFixed(3) || 'N/A'} €/kWh
                  </div>
                </div>
              </div>
              
              {/* Indicateurs de performance */}
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className={`text-lg font-bold ${results.system_stability ? 'text-green-600' : 'text-red-600'}`}>
                    {results.system_stability ? '✅ STABLE' : '⚠️ INSTABLE'}
                  </div>
                  <div className="text-sm text-gray-600">Stabilité Système</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {results.energy_consumption?.toFixed(3) || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">Conso. (kWh/m³)</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">
                    {results.optimization_potential?.energy_savings?.toFixed(1) || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">Potentiel (%)</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Économie possible
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Graphiques de performance */}
          {results && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                📈 Courbes de Performance Expert
              </h3>
              <canvas ref={chartRef} className="w-full h-96"></canvas>
            </div>
          )}
        </div>
      </div>

      {/* Schéma d'installation expert */}
      {results && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">🏗️ Schéma d'Installation Expert</h3>
          <div className="flex justify-center">
            <ExpertInstallationSchema inputData={inputData} results={results} pipeMaterials={pipeMaterials} fluids={fluids} />
          </div>
        </div>
      )}

      {/* Recommandations d'expert */}
      {results && results.expert_recommendations && results.expert_recommendations.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">🎯 Recommandations d'Expert</h3>
          <div className="space-y-4">
            {results.expert_recommendations.map((rec, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                rec.type === 'critical' ? 'border-red-500 bg-red-50' :
                rec.type === 'energy' ? 'border-green-500 bg-green-50' :
                rec.type === 'hydraulic' ? 'border-blue-500 bg-blue-50' :
                rec.type === 'electrical' ? 'border-yellow-500 bg-yellow-50' :
                'border-gray-500 bg-gray-50'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className={`font-bold text-sm ${
                    rec.type === 'critical' ? 'text-red-800' :
                    rec.type === 'energy' ? 'text-green-800' :
                    rec.type === 'hydraulic' ? 'text-blue-800' :
                    rec.type === 'electrical' ? 'text-yellow-800' :
                    'text-gray-800'
                  }`}>
                    {rec.title}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    rec.urgency === 'IMMÉDIATE' ? 'bg-red-100 text-red-800' :
                    rec.urgency === 'HAUTE' ? 'bg-orange-100 text-orange-800' :
                    rec.urgency === 'MOYENNE' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {rec.urgency}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{rec.description}</p>
                <p className="text-xs text-gray-600 mb-3 font-medium">Impact: {rec.impact}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {rec.solutions.map((solution, i) => (
                    <div key={i} className="flex items-start text-sm">
                      <span className="text-green-600 mr-2 mt-1">•</span>
                      <span>{solution}</span>
                    </div>
                  ))}
                </div>
                {rec.cost_impact && (
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <span className="text-xs font-medium text-gray-600">
                      Impact économique: {rec.cost_impact}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Composant pour le schéma d'installation expert
const ExpertInstallationSchema = ({ inputData, results, pipeMaterials, fluids }) => {
  const isFlooded = inputData.suction_type === 'flooded';
  
  // Configuration dynamique plus prononcée selon le type d'aspiration
  const config = {
    flooded: {
      reservoirY: 120,
      reservoirHeight: 150,
      pumpY: 320,
      statusColor: '#10b981',
      statusIcon: '⬇️',
      statusText: 'EN CHARGE',
      description: 'Pompe en contrebas - Aspiration gravitaire'
    },
    suction_lift: {
      reservoirY: 320,
      reservoirHeight: 120,
      pumpY: 200,
      statusColor: '#ef4444',
      statusIcon: '⬆️',
      statusText: 'EN DÉPRESSION',
      description: 'Pompe en surélévation - Aspiration par dépression'
    }
  };
  
  const currentConfig = isFlooded ? config.flooded : config.suction_lift;
  const waterLevel = currentConfig.reservoirY + 25;
  
  // Calcul dynamique de la position de la pompe selon la hauteur
  const heightScale = Math.min(Math.max(Math.abs(inputData.suction_height) * 12, 20), 100);
  const actualPumpY = isFlooded 
    ? waterLevel + heightScale + 20  // Pompe encore plus bas en charge
    : waterLevel - heightScale - 60; // Pompe encore plus haut en dépression
  
  // Configuration des couleurs selon le type d'installation
  const aspirationColor = currentConfig.statusColor;
  const statusIcon = currentConfig.statusIcon;
  const statusText = currentConfig.statusText;
  
  return (
    <svg width="1200" height="800" viewBox="0 0 1200 800" className="border border-gray-200 rounded-lg">
      <defs>
        <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{stopColor:'#3b82f6', stopOpacity:0.8}} />
          <stop offset="100%" style={{stopColor:'#1e40af', stopOpacity:0.9}} />
        </linearGradient>
        <linearGradient id="pumpGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{stopColor:'#10b981', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#059669', stopOpacity:1}} />
        </linearGradient>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{stopColor:'#f8fafc', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#e2e8f0', stopOpacity:1}} />
        </linearGradient>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="3" dy="3" stdDeviation="4" floodColor="rgba(0,0,0,0.3)"/>
        </filter>
        <marker id="arrowRed" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#ef4444" />
        </marker>
        <marker id="arrowBlue" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#3b82f6" />
        </marker>
        <marker id="arrowGreen" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#10b981" />
        </marker>
      </defs>
      
      <rect width="1200" height="800" fill="url(#bgGradient)" />
      
      {/* Grille de fond */}
      <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
        <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#e5e7eb" strokeWidth="1" opacity="0.3"/>
      </pattern>
      <rect width="1200" height="800" fill="url(#grid)" />
      
      {/* Sol/Base avec référence */}
      <rect x="0" y="750" width="1200" height="50" fill="#8b5cf6" opacity="0.3" />
      <text x="600" y="775" textAnchor="middle" className="text-sm font-medium" fill="#6b7280">
        🌍 NIVEAU SOL - RÉFÉRENCE ALTIMÉTRIQUE
      </text>
      
      {/* Titre dynamique avec configuration amélioré */}
      <rect x="20" y="20" width="600" height="100" fill="white" stroke={aspirationColor} strokeWidth="3" rx="12" filter="url(#shadow)"/>
      <text x="320" y="45" textAnchor="middle" className="text-lg font-bold" fill={aspirationColor}>
        {statusIcon} CONFIGURATION {statusText}
      </text>
      <text x="320" y="65" textAnchor="middle" className="text-sm" fill="#6b7280">
        {currentConfig.description}
      </text>
      <text x="320" y="85" textAnchor="middle" className="text-sm font-medium" fill="#4b5563">
        Q={inputData.flow_rate} m³/h • H={Math.abs(inputData.suction_height)}m • T={inputData.temperature}°C
      </text>
      <text x="320" y="105" textAnchor="middle" className="text-xs" fill="#6b7280">
        {inputData.engineer_firstname} {inputData.engineer_name} - {inputData.company_name}
      </text>
      
      {/* Réservoir avec détails selon la configuration */}
      <rect 
        x="50" 
        y={currentConfig.reservoirY} 
        width="220" 
        height={currentConfig.reservoirHeight} 
        fill="#d1d5db" 
        stroke="#6b7280" 
        strokeWidth="4"
        rx="10"
        filter="url(#shadow)"
      />
      
      {/* Niveau d'eau dynamique */}
      <rect 
        x="58" 
        y={waterLevel} 
        width="204" 
        height={currentConfig.reservoirHeight - 35} 
        fill="url(#waterGradient)"
        rx="6"
      />
      
      {/* Vagues animées sur le niveau d'eau */}
      <path 
        d={`M 58 ${waterLevel} Q 78 ${waterLevel-4} 98 ${waterLevel} T 138 ${waterLevel} T 178 ${waterLevel} T 218 ${waterLevel} T 262 ${waterLevel}`}
        stroke="#1d4ed8" 
        strokeWidth="4" 
        fill="none"
        opacity="0.8"
      />
      
      {/* Étiquettes du réservoir améliorées */}
      <text x="160" y={currentConfig.reservoirY - 15} textAnchor="middle" className="text-sm font-bold" fill="#1f2937">
        🏛️ RÉSERVOIR
      </text>
      <text x="160" y={currentConfig.reservoirY - 2} textAnchor="middle" className="text-xs" fill="#6b7280">
        {fluids.find(f => f.id === inputData.fluid_type)?.name || 'Fluide'} - {inputData.temperature}°C
      </text>
      
      {/* Indication du niveau d'eau */}
      <text x="280" y={waterLevel + 5} className="text-xs font-bold" fill="#1d4ed8">
        💧 Niveau
      </text>
      <text x="280" y={waterLevel + 16} className="text-xs" fill="#6b7280">
        Référence
      </text>
      
      {/* Tuyauterie d'aspiration avec épaisseur proportionnelle */}
      <line 
        x1="270" 
        y1={waterLevel} 
        x2="450" 
        y2={actualPumpY + 40} 
        stroke={aspirationColor} 
        strokeWidth={Math.max(10, inputData.suction_pipe_diameter / 10)}
        strokeLinecap="round"
        filter="url(#shadow)"
        opacity="0.9"
      />
      
      {/* Crépine d'aspiration détaillée */}
      <g transform={`translate(270, ${waterLevel})`}>
        <circle cx="0" cy="0" r="12" fill="#6b7280" stroke="#374151" strokeWidth="3" />
        <circle cx="0" cy="0" r="8" fill="none" stroke="#ffffff" strokeWidth="2" />
        <path d="M -6 -6 L 6 6 M -6 6 L 6 -6" stroke="#ffffff" strokeWidth="1" />
      </g>
      <text x="270" y={waterLevel + 23} textAnchor="middle" className="text-xs font-medium" fill="#6b7280">
        🔧 Crépine
      </text>
      
      {/* Pompe - Position et design selon configuration */}
      <g transform={`translate(450, ${actualPumpY})`}>
        <rect 
          x="0" 
          y="0" 
          width="100" 
          height="80" 
          fill="url(#pumpGradient)"
          stroke="#047857" 
          strokeWidth="5"
          rx="15"
          filter="url(#shadow)"
        />
        
        {/* Détails internes de la pompe */}
        <circle cx="50" cy="40" r="25" fill="none" stroke="white" strokeWidth="4" />
        <path d="M 35 40 Q 50 25 65 40 Q 50 55 35 40" fill="white" opacity="0.9" />
        
        {/* Roue et flèches de rotation */}
        <circle cx="50" cy="40" r="15" fill="none" stroke="white" strokeWidth="2" />
        <path d="M 45 35 Q 55 35 55 45 Q 45 45 45 35" fill="white" opacity="0.7" />
        
        {/* Étiquettes pompe */}
        <text x="50" y="15" textAnchor="middle" className="text-xs font-bold" fill="white">
          🔄 POMPE
        </text>
        <text x="50" y="70" textAnchor="middle" className="text-xs font-medium" fill="white">
          η={inputData.pump_efficiency}%
        </text>
        
        {/* Indicateur de direction */}
        <path 
          d={`M 10 40 Q 25 ${isFlooded ? 30 : 50} 40 40 Q 25 ${isFlooded ? 50 : 30} 10 40`}
          fill={aspirationColor} 
          opacity="0.6"
        />
      </g>
      
      {/* Étiquette de pompe avec spécifications */}
      <text x="500" y={actualPumpY + 100} textAnchor="middle" className="text-xs font-bold" fill="#047857">
        {inputData.pump_type || 'CENTRIFUGE'} • {inputData.installation_type?.toUpperCase() || 'SURFACE'}
      </text>
      
      {/* Tuyauterie de refoulement */}
      <line 
        x1="550" 
        y1={actualPumpY + 40} 
        x2="650" 
        y2={actualPumpY + 40} 
        stroke="#4b5563" 
        strokeWidth={Math.max(10, inputData.discharge_pipe_diameter / 10)}
        strokeLinecap="round"
        filter="url(#shadow)"
      />
      
      {/* Coude de refoulement avec raccordement vertical */}
      <path 
        d={`M 650 ${actualPumpY + 40} Q 680 ${actualPumpY + 40} 680 ${actualPumpY + 10} L 680 140`}
        stroke="#4b5563" 
        strokeWidth={Math.max(10, inputData.discharge_pipe_diameter / 10)}
        fill="none"
        strokeLinecap="round"
        filter="url(#shadow)"
      />
      
      {/* Sortie finale avec détails */}
      <g transform="translate(680, 120)">
        <rect x="-10" y="0" width="20" height="25" fill="#10b981" rx="8" filter="url(#shadow)" />
        <circle cx="0" cy="12" r="6" fill="#ffffff" />
        <text x="0" y="17" textAnchor="middle" className="text-xs font-bold" fill="#10b981">
          💧
        </text>
      </g>
      <text x="720" y="120" className="text-xs font-bold" fill="#10b981">
        🎯 SORTIE
      </text>
      <text x="720" y="132" className="text-xs" fill="#6b7280">
        H={inputData.discharge_height}m
      </text>
      
      {/* Cotes dynamiques renforcées */}
      
      {/* Hauteur d'aspiration avec double flèche */}
      <line 
        x1="20" 
        y1={waterLevel} 
        x2="20" 
        y2={actualPumpY + 40} 
        stroke="#ef4444" 
        strokeWidth="2"
        markerEnd="url(#arrowRed)"
      />
      <line 
        x1="20" 
        y1={actualPumpY + 40} 
        x2="20" 
        y2={waterLevel} 
        stroke="#ef4444" 
        strokeWidth="2"
        markerEnd="url(#arrowRed)"
      />
      
      {/* Encadré de cote avec couleur d'aspiration */}
      <rect 
        x="0" 
        y={(waterLevel + actualPumpY + 40) / 2 - 35} 
        width="60" 
        height="70" 
        fill="white" 
        stroke={aspirationColor} 
        strokeWidth="3" 
        rx="8"
        filter="url(#shadow)"
      />
      <text 
        x="30" 
        y={(waterLevel + actualPumpY + 40) / 2 - 15} 
        textAnchor="middle" 
        className="text-lg font-bold" 
        fill={aspirationColor}
      >
        {Math.abs(inputData.suction_height).toFixed(1)}m
      </text>
      <text 
        x="30" 
        y={(waterLevel + actualPumpY + 40) / 2 + 5} 
        textAnchor="middle" 
        className="text-xs font-medium" 
        fill={aspirationColor}
      >
        {statusText}
      </text>
      <text 
        x="30" 
        y={(waterLevel + actualPumpY + 40) / 2 + 20} 
        textAnchor="middle" 
        className="text-xs" 
        fill="#6b7280"
      >
        {isFlooded ? 'Gravitaire' : 'Aspiration'}
      </text>
      
      {/* Hauteur de refoulement */}
      <line 
        x1="720" 
        y1={actualPumpY + 40} 
        x2="720" 
        y2="140" 
        stroke="#10b981" 
        strokeWidth="2"
        markerEnd="url(#arrowGreen)"
      />
      <line 
        x1="720" 
        y1="140" 
        x2="720" 
        y2={actualPumpY + 40} 
        stroke="#10b981" 
        strokeWidth="2"
        markerEnd="url(#arrowGreen)"
      />
      
      <rect 
        x="730" 
        y={(actualPumpY + 40 + 140) / 2 - 20} 
        width="80" 
        height="40" 
        fill="white" 
        stroke="#10b981" 
        strokeWidth="3" 
        rx="8"
        filter="url(#shadow)"
      />
      <text 
        x="770" 
        y={(actualPumpY + 40 + 140) / 2 - 5} 
        textAnchor="middle" 
        className="text-sm font-bold" 
        fill="#10b981"
      >
        {inputData.discharge_height.toFixed(1)}m
      </text>
      <text 
        x="770" 
        y={(actualPumpY + 40 + 140) / 2 + 10} 
        textAnchor="middle" 
        className="text-xs" 
        fill="#6b7280"
      >
        REFOULEMENT
      </text>
      
      {/* Flèches de débit avec dimensions optimisées */}
      <line 
        x1="320" 
        y1={waterLevel + 20} 
        x2="420" 
        y2={actualPumpY + 20} 
        stroke="#3b82f6" 
        strokeWidth="4"
        markerEnd="url(#arrowBlue)"
        opacity="0.9"
      />
      <text 
        x="370" 
        y={(waterLevel + actualPumpY + 40) / 2 - 20} 
        textAnchor="middle" 
        className="text-sm font-bold" 
        fill="#3b82f6"
      >
        Q = {inputData.flow_rate} m³/h
      </text>
      <text 
        x="370" 
        y={(waterLevel + actualPumpY + 40) / 2 - 5} 
        textAnchor="middle" 
        className="text-xs" 
        fill="#3b82f6"
      >
        V = {results.npshd_analysis?.velocity?.toFixed(2) || 'N/A'} m/s
      </text>
      <text 
        x="370" 
        y={(waterLevel + actualPumpY + 40) / 2 + 10} 
        textAnchor="middle" 
        className="text-xs" 
        fill="#6b7280"
      >
        ⌀{inputData.suction_pipe_diameter}mm
      </text>
      
      {/* Flèche de refoulement */}
      <line 
        x1="570" 
        y1={actualPumpY + 40} 
        x2="630" 
        y2={actualPumpY + 40} 
        stroke="#3b82f6" 
        strokeWidth="4"
        markerEnd="url(#arrowBlue)"
        opacity="0.9"
      />
      <text 
        x="600" 
        y={actualPumpY + 65} 
        textAnchor="middle" 
        className="text-xs font-bold" 
        fill="#3b82f6"
      >
        {results.hmt_analysis?.discharge_velocity?.toFixed(2) || 'N/A'} m/s
      </text>
      <text 
        x="600" 
        y={actualPumpY + 80} 
        textAnchor="middle" 
        className="text-xs" 
        fill="#6b7280"
      >
        ⌀{inputData.discharge_pipe_diameter}mm
      </text>
      
      {/* Panel d'informations techniques expert étendu */}
      <rect x="840" y="80" width="340" height="660" fill="white" stroke="#d1d5db" strokeWidth="4" rx="20" filter="url(#shadow)" />
      <rect x="840" y="80" width="340" height="70" fill={aspirationColor} rx="20" />
      <text x="1010" y="125" textAnchor="middle" className="text-xl font-bold" fill="white">
        📊 EXPERT HYDRAULIQUE
      </text>
      
      {/* Section Propriétés du Fluide avec calculs automatiques */}
      <rect x="850" y="160" width="320" height="150" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2" rx="10" />
      <text x="860" y="180" className="text-sm font-bold" fill="#0c4a6e">💧 PROPRIÉTÉS DU FLUIDE</text>
      
      <text x="860" y="200" className="text-xs" fill="#1f2937">
        Type: {fluids.find(f => f.id === inputData.fluid_type)?.name || 'N/A'}
      </text>
      <text x="860" y="215" className="text-xs" fill="#1f2937">
        Température: {inputData.temperature}°C
      </text>
      <text x="860" y="230" className="text-xs" fill="#1f2937">
        Masse volumique: {(() => {
          // Calcul direct des propriétés pour le SVG
          let density = 1000; // valeur par défaut eau
          
          if (inputData.fluid_type === 'water') {
            density = 1000 - 0.2 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'oil') {
            density = 850 - 0.7 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'acid') {
            density = 1200 - 0.3 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'glycol') {
            density = 1113 - 0.8 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'palm_oil') {
            density = 915 - 0.65 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'gasoline') {
            density = 740 - 0.9 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'diesel') {
            density = 840 - 0.75 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'hydraulic_oil') {
            density = 875 - 0.65 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'ethanol') {
            density = 810 - 1.05 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'seawater') {
            density = 1025 - 0.25 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'methanol') {
            density = 792 - 1.2 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'glycerol') {
            density = 1260 - 0.65 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'milk') {
            density = 1030 - 0.3 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'honey') {
            density = 1400 - 0.8 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'wine') {
            density = 990 - 0.9 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'bleach') {
            density = 1050 - 0.25 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'yogurt') {
            density = 1050 - 0.35 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'tomato_sauce') {
            density = 1100 - 0.4 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'soap_solution') {
            density = 1010 - 0.28 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'fruit_juice') {
            density = 1045 - 0.35 * (inputData.temperature - 20);
          }
          
          return Math.max(density, 500).toFixed(1);
        })()} kg/m³
      </text>
      <text x="860" y="245" className="text-xs" fill="#1f2937">
        Viscosité: {(() => {
          // Calcul direct de la viscosité pour tous les fluides
          let viscosity = 0.001; // valeur par défaut eau
          
          if (inputData.fluid_type === 'water') {
            viscosity = 0.001 - 0.00005 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'oil') {
            viscosity = 0.05 - 0.002 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'acid') {
            viscosity = 0.002 - 0.0001 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'glycol') {
            viscosity = 0.0161 - 0.0008 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'palm_oil') {
            viscosity = 0.045 - 0.0018 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'gasoline') {
            viscosity = 0.00055 - 0.000015 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'diesel') {
            viscosity = 0.0035 - 0.00012 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'hydraulic_oil') {
            viscosity = 0.046 - 0.0019 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'ethanol') {
            viscosity = 0.0012 - 0.00004 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'seawater') {
            viscosity = 0.00107 - 0.000052 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'methanol') {
            viscosity = 0.00059 - 0.000025 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'glycerol') {
            viscosity = 1.48 - 0.058 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'milk') {
            viscosity = 0.0015 - 0.00006 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'honey') {
            viscosity = 8.5 - 0.25 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'wine') {
            viscosity = 0.0012 - 0.00004 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'bleach') {
            viscosity = 0.0011 - 0.000045 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'yogurt') {
            viscosity = 0.15 - 0.008 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'tomato_sauce') {
            viscosity = 2.5 - 0.12 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'soap_solution') {
            viscosity = 0.0013 - 0.00005 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'fruit_juice') {
            viscosity = 0.0018 - 0.00007 * (inputData.temperature - 20);
          }
          
          return Math.max(viscosity, 0.0001).toFixed(4);
        })()} Pa·s
      </text>
      <text x="860" y="260" className="text-xs" fill="#1f2937">
        P. vapeur: {(() => {
          // Calcul direct de la pression de vapeur pour tous les fluides
          let vaporPressure = 2340; // valeur par défaut eau
          
          if (inputData.fluid_type === 'water') {
            vaporPressure = 2340 + 100 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'oil') {
            vaporPressure = 100 + 20 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'acid') {
            vaporPressure = 3000 + 150 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'glycol') {
            vaporPressure = 10 + 5 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'palm_oil') {
            vaporPressure = 0.001 + 0.0001 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'gasoline') {
            vaporPressure = 13000 + 850 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'diesel') {
            vaporPressure = 300 + 25 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'hydraulic_oil') {
            vaporPressure = 0.1 + 0.02 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'ethanol') {
            vaporPressure = 5870 + 420 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'seawater') {
            vaporPressure = 2280 + 95 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'methanol') {
            vaporPressure = 12800 + 780 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'glycerol') {
            vaporPressure = 0.001 + 0.0002 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'milk') {
            vaporPressure = 2200 + 95 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'honey') {
            vaporPressure = 0.1 + 0.02 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'wine') {
            vaporPressure = 2800 + 120 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'bleach') {
            vaporPressure = 2100 + 90 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'yogurt') {
            vaporPressure = 2150 + 92 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'tomato_sauce') {
            vaporPressure = 1800 + 75 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'soap_solution') {
            vaporPressure = 2250 + 95 * (inputData.temperature - 20);
          } else if (inputData.fluid_type === 'fruit_juice') {
            vaporPressure = 2100 + 88 * (inputData.temperature - 20);
          }
          
          return (Math.max(vaporPressure, 1) / 1000).toFixed(1);
        })()} kPa
      </text>
      <text x="860" y="275" className="text-xs" fill="#1f2937">
        P. atmosphérique: {results.npshd_analysis?.atmospheric_pressure ? 
          (results.npshd_analysis.atmospheric_pressure / 1000).toFixed(1) : '101.3'} kPa
      </text>
      <text x="860" y="290" className="text-xs" fill="#1f2937">
        Altitude: {inputData.altitude || 0}m
      </text>
      <text x="860" y="305" className="text-xs" fill="#1f2937">
        Temp. ambiante: {inputData.ambient_temperature || 25}°C
      </text>
      
      {/* Section Configuration */}
      <rect x="850" y="320" width="320" height="100" fill={isFlooded ? "#e0f2fe" : "#fef2f2"} stroke={aspirationColor} strokeWidth="2" rx="10" />
      <text x="860" y="340" className="text-sm font-bold" fill={aspirationColor}>
        {statusIcon} CONFIGURATION {statusText}
      </text>
      
      <text x="860" y="360" className="text-xs" fill="#1f2937">
        Installation: {inputData.installation_type === 'surface' ? 'Surface' : 'Immergée'}
      </text>
      <text x="860" y="375" className="text-xs" fill="#1f2937">
        Type aspiration: {isFlooded ? 'Gravitaire (charge)' : 'Dépression (lift)'}
      </text>
      <text x="860" y="390" className="text-xs" fill="#1f2937">
        Hauteur: {Math.abs(inputData.suction_height).toFixed(1)}m {isFlooded ? '(sous pompe)' : '(à aspirer)'}
      </text>
      <text x="860" y="405" className="text-xs" fill="#1f2937">
        Avantages: {isFlooded ? 'Amorçage auto, fiabilité' : 'Pompe protégée, maintenance'}
      </text>
      
      {/* Section Hydraulique */}
      <rect x="850" y="430" width="320" height="140" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" rx="10" />
      <text x="860" y="450" className="text-sm font-bold" fill="#1e40af">⚡ HYDRAULIQUE</text>
      
      <text x="860" y="470" className="text-xs" fill="#1f2937">
        Débit nominal: {inputData.flow_rate} m³/h ({((inputData.flow_rate || 0) / 3.6).toFixed(3)} m³/s)
      </text>
      <text x="860" y="485" className="text-xs" fill="#1f2937">
        NPSHd calculé: {results.npshd_analysis?.npshd?.toFixed(2) || 'N/A'} m
      </text>
      <text x="860" y="500" className="text-xs" fill="#1f2937">
        NPSH requis: {inputData.npsh_required} m
      </text>
      <text x="860" y="515" className="text-xs" fill="#1f2937">
        Marge sécurité: {results.npshd_analysis?.npsh_margin?.toFixed(2) || 'N/A'} m
      </text>
      <text x="860" y="530" className="text-xs" fill="#1f2937">
        HMT total: {results.hmt_analysis?.hmt?.toFixed(2) || 'N/A'} m
      </text>
      <text x="860" y="545" className="text-xs" fill="#1f2937">
        Vitesse aspiration: {results.npshd_analysis?.velocity?.toFixed(2) || 'N/A'} m/s
      </text>
      <text x="860" y="560" className="text-xs" fill="#1f2937">
        Régime écoulement: {results.npshd_analysis?.reynolds_number > 4000 ? 'Turbulent' : 
                  results.npshd_analysis?.reynolds_number > 2300 ? 'Transitoire' : 'Laminaire'} 
        (Re={results.npshd_analysis?.reynolds_number?.toFixed(0) || 'N/A'})
      </text>
      
      {/* Section Pertes de charge */}
      <rect x="850" y="580" width="320" height="100" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" rx="10" />
      <text x="860" y="600" className="text-sm font-bold" fill="#92400e">📉 PERTES DE CHARGE</text>
      
      <text x="860" y="620" className="text-xs" fill="#1f2937">
        Pertes aspiration: {results.npshd_analysis?.total_head_loss?.toFixed(2) || 'N/A'} m
      </text>
      <text x="860" y="635" className="text-xs" fill="#1f2937">
        Pertes refoulement: {results.hmt_analysis?.total_head_loss?.toFixed(2) || 'N/A'} m
      </text>
      <text x="860" y="650" className="text-xs" fill="#1f2937">
        Pertes totales: {results.total_head_loss?.toFixed(2) || 'N/A'} m
      </text>
      <text x="860" y="665" className="text-xs" fill="#1f2937">
        Coefficient K total: {((results.total_head_loss || 0) / ((results.npshd_analysis?.velocity || 1)**2 / (2 * 9.81))).toFixed(1)}
      </text>
      
      {/* Section Performance */}
      <rect x="850" y="690" width="320" height="60" fill="#f0fdf4" stroke="#10b981" strokeWidth="2" rx="10" />
      <text x="860" y="710" className="text-sm font-bold" fill="#166534">📈 PERFORMANCE</text>
      
      <text x="860" y="730" className="text-xs" fill="#1f2937">
        Rendement global: {results.overall_efficiency?.toFixed(1) || 'N/A'}% 
        (Pompe: {inputData.pump_efficiency}% × Moteur: {inputData.motor_efficiency}%)
      </text>
      <text x="860" y="745" className="text-xs" fill="#1f2937">
        Puissance: {results.performance_analysis?.hydraulic_power?.toFixed(1) || 'N/A'} kW hydraulique
      </text>
      
      {/* Indicateurs de statut dynamiques */}
      <g transform="translate(1010, 745)">
        <circle 
          cx="0" 
          cy="0" 
          r="18" 
          fill={results.npshd_analysis?.cavitation_risk ? "#ef4444" : "#10b981"}
          stroke="white"
          strokeWidth="4"
          filter="url(#shadow)"
        />
        <text 
          x="0" 
          y="7" 
          textAnchor="middle" 
          className="text-lg font-bold" 
          fill="white"
        >
          {results.npshd_analysis?.cavitation_risk ? "!" : "✓"}
        </text>
        <text 
          x="0" 
          y="40" 
          textAnchor="middle" 
          className="text-sm font-bold" 
          fill={results.npshd_analysis?.cavitation_risk ? "#ef4444" : "#10b981"}
        >
          {results.npshd_analysis?.cavitation_risk ? "CAVITATION" : "SÉCURISÉ"}
        </text>
      </g>
      
      {/* Légende enrichie dynamique */}
      <rect x="20" y="720" width="800" height="60" fill="white" stroke="#d1d5db" strokeWidth="3" rx="10" filter="url(#shadow)" />
      <text x="30" y="740" className="text-sm font-bold" fill="#1f2937">
        LÉGENDE TECHNIQUE - CONFIGURATION {statusText}:
      </text>
      
      <line x1="30" y1="755" x2="50" y2="755" stroke={aspirationColor} strokeWidth="2" markerEnd="url(#arrowRed)" />
      <text x="55" y="760" className="text-xs font-medium" fill={aspirationColor}>
        {isFlooded ? 'Charge gravitaire' : 'Aspiration dépression'}
      </text>
      
      <line x1="200" y1="755" x2="220" y2="755" stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrowBlue)" />
      <text x="225" y="760" className="text-xs font-medium" fill="#3b82f6">
        Sens d'écoulement
      </text>
      
      <rect x="350" y="750" width="18" height="10" fill="url(#waterGradient)" />
      <text x="375" y="760" className="text-xs font-medium" fill="#3b82f6">
        {fluids.find(f => f.id === inputData.fluid_type)?.name || 'Fluide'}
      </text>
      
      <rect x="450" y="750" width="18" height="10" fill="url(#pumpGradient)" />
      <text x="475" y="760" className="text-xs font-medium" fill="#10b981">
        Pompe centrifuge
      </text>
      
      <circle cx="570" cy="755" r="8" fill={results.npshd_analysis?.cavitation_risk ? "#ef4444" : "#10b981"} />
      <text x="585" y="760" className="text-xs font-medium" fill="#6b7280">
        Statut hydraulique
      </text>
      
      <text x="700" y="760" className="text-xs font-medium" fill="#6b7280">
        {currentConfig.description}
      </text>
      
      <text x="30" y="775" className="text-xs" fill="#6b7280">
        ⚙️ {statusText}: {isFlooded ? 'Pompe alimentée par gravité - Fiabilité optimale' : 'Pompe aspire le fluide - Attention NPSHd'}
      </text>
    </svg>
  );
};


// Component pour Tab 3 - Analyse de Performance
const PerformanceAnalysis = ({ fluids, pipeMaterials }) => {
  const [inputData, setInputData] = useState({
    flow_rate: 50,
    hmt: 25,
    pipe_diameter: 100,
    fluid_type: 'water',
    pipe_material: 'pvc',
    pump_efficiency: 75,
    motor_efficiency: 90,
    absorbed_power: null,
    hydraulic_power: null,
    starting_method: 'star_delta',
    power_factor: 0.8,
    cable_length: 50,
    cable_material: 'copper',
    cable_section: null,
    voltage: 400
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const powerChartRef = useRef(null);
  const powerChartInstance = useRef(null);

  const handleInputChange = (field, value) => {
    setInputData(prev => ({ ...prev, [field]: value }));
  };

  const calculatePerformance = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API}/calculate-performance`, inputData);
      setResult(response.data);
      updateChart(response.data);
      updatePowerChart(response.data);
    } catch (error) {
      console.error('Erreur analyse performance:', error);
      alert('Erreur lors de l\'analyse de performance: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const updatePowerChart = (data) => {
    if (!powerChartRef.current) return;

    const ctx = powerChartRef.current.getContext('2d');
    
    if (powerChartInstance.current) {
      powerChartInstance.current.destroy();
    }

    const curves = data.performance_curves;
    const bestPoint = curves.best_operating_point;
    
    powerChartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: curves.flow,
        datasets: [
          {
            label: 'Puissance Absorbée (kW)',
            data: curves.power,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderWidth: 3,
            pointRadius: 0,
            pointHoverRadius: 8,
            tension: 0.4,
            fill: false
          },
          {
            label: 'Point de Fonctionnement',
            data: curves.flow.map((f, index) => {
              if (Math.abs(f - bestPoint.flow) < 0.1) {
                return curves.power[index];
              }
              return null;
            }),
            borderColor: '#000000',
            backgroundColor: '#000000',
            borderWidth: 4,
            pointRadius: 8,
            pointHoverRadius: 12,
            showLine: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Débit (m³/h)',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Puissance Absorbée (kW)',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                size: 12,
                weight: 'bold'
              },
              usePointStyle: true
            }
          },
          title: {
            display: true,
            text: 'Courbe de Puissance Absorbée',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          tooltip: {
            callbacks: {
              afterLabel: function(context) {
                const datasetLabel = context.dataset.label;
                
                if (datasetLabel.includes('Puissance')) {
                  return `Puissance au point de fonctionnement: ${bestPoint.power?.toFixed(2)} kW`;
                } else if (datasetLabel.includes('Point')) {
                  return `Point de fonctionnement saisi: Q=${bestPoint.flow}m³/h, P=${bestPoint.power?.toFixed(2)}kW`;
                }
                return '';
              }
            }
          }
        }
      }
    });
  };

  const updateChart = (data) => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const curves = data.performance_curves;
    const bestPoint = curves.best_operating_point;
    
    // Trouver l'index du point de fonctionnement dans les courbes
    const operatingPointIndex = curves.flow.findIndex(f => Math.abs(f - bestPoint.flow) < 0.1);
    
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: curves.flow,
        datasets: [
          {
            label: 'HMT Pompe (m)',
            data: curves.hmt,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
            pointRadius: 0,
            pointHoverRadius: 8,
            tension: 0.4,
            fill: false,
            yAxisID: 'y'
          },
          {
            label: 'Pertes de Charge Réseau (m)',
            data: curves.head_loss,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 3,
            pointRadius: 0,
            pointHoverRadius: 8,
            tension: 0.4,
            fill: false,
            yAxisID: 'y'
          },
          {
            label: 'Rendement (%)',
            data: curves.efficiency,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 8,
            tension: 0.4,
            fill: false,
            yAxisID: 'y1'
          },
          {
            label: 'Point de Fonctionnement',
            data: curves.flow.map((f, index) => {
              if (Math.abs(f - bestPoint.flow) < 0.1) {
                return curves.hmt[index];
              }
              return null;
            }),
            borderColor: '#000000',
            backgroundColor: '#000000',
            borderWidth: 4,
            pointRadius: 8,
            pointHoverRadius: 12,
            showLine: false,
            yAxisID: 'y'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Débit (m³/h)',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'HMT (m)',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Rendement (%)',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            min: 0,
            max: 100,
            grid: {
              drawOnChartArea: false,
            },
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                size: 12,
                weight: 'bold'
              },
              usePointStyle: true
            }
          },
          title: {
            display: true,
            text: 'Courbes de Performance Hydraulique Q/H',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          tooltip: {
            callbacks: {
              afterLabel: function(context) {
                const flowValue = curves.flow[context.dataIndex];
                const datasetLabel = context.dataset.label;
                
                if (datasetLabel.includes('HMT')) {
                  return `Point de croisement: Q=${bestPoint.flow}m³/h, H=${bestPoint.hmt}m`;
                } else if (datasetLabel.includes('Pertes')) {
                  return `Point de croisement: Q=${bestPoint.flow}m³/h, H=${bestPoint.hmt}m`;
                } else if (datasetLabel.includes('Rendement')) {
                  return `Rendement au point de fonctionnement: ${bestPoint.efficiency?.toFixed(1)}%`;
                } else if (datasetLabel.includes('Point')) {
                  return `Point de fonctionnement saisi: Q=${bestPoint.flow}m³/h, H=${bestPoint.hmt}m`;
                }
                return '';
              }
            }
          }
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">🟨 Analyse de Performance & Calculs Électriques</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Paramètres hydrauliques */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Paramètres Hydrauliques</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Débit (m³/h)
                </label>
                <input
                  type="number"
                  value={inputData.flow_rate}
                  onChange={(e) => handleInputChange('flow_rate', parseFloat(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  HMT (m)
                </label>
                <input
                  type="number"
                  value={inputData.hmt}
                  onChange={(e) => handleInputChange('hmt', parseFloat(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diamètre de tuyauterie (mm)
                </label>
                <input
                  type="number"
                  value={inputData.pipe_diameter}
                  onChange={(e) => handleInputChange('pipe_diameter', parseFloat(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de fluide
                </label>
                <select
                  value={inputData.fluid_type}
                  onChange={(e) => handleInputChange('fluid_type', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {fluids.map(fluid => (
                    <option key={fluid.id} value={fluid.id}>{fluid.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Matériau de tuyauterie
                </label>
                <select
                  value={inputData.pipe_material}
                  onChange={(e) => handleInputChange('pipe_material', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {pipeMaterials.map(material => (
                    <option key={material.id} value={material.id}>{material.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Paramètres électriques */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Paramètres Électriques</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rendement pompe (%)
                </label>
                <input
                  type="number"
                  value={inputData.pump_efficiency}
                  onChange={(e) => handleInputChange('pump_efficiency', parseFloat(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rendement moteur (%)
                </label>
                <input
                  type="number"
                  value={inputData.motor_efficiency}
                  onChange={(e) => handleInputChange('motor_efficiency', parseFloat(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Puissance absorbée P1 (kW) - Optionnel
                </label>
                <input
                  type="number"
                  value={inputData.absorbed_power || ''}
                  onChange={(e) => handleInputChange('absorbed_power', e.target.value ? parseFloat(e.target.value) : null)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Puissance hydraulique P2 (kW) - Optionnel
                </label>
                <input
                  type="number"
                  value={inputData.hydraulic_power || ''}
                  onChange={(e) => handleInputChange('hydraulic_power', e.target.value ? parseFloat(e.target.value) : null)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Méthode de démarrage
                </label>
                <select
                  value={inputData.starting_method}
                  onChange={(e) => handleInputChange('starting_method', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="star_delta">Étoile-Triangle</option>
                  <option value="direct_on_line">Démarrage direct</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facteur de puissance (cos φ)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  max="1"
                  value={inputData.power_factor}
                  onChange={(e) => handleInputChange('power_factor', parseFloat(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longueur de câble (m)
                </label>
                <input
                  type="number"
                  value={inputData.cable_length}
                  onChange={(e) => handleInputChange('cable_length', parseFloat(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Matériau de câble
                </label>
                <select
                  value={inputData.cable_material}
                  onChange={(e) => handleInputChange('cable_material', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="copper">Cuivre</option>
                  <option value="aluminum">Aluminium</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tension (V)
                </label>
                <select
                  value={inputData.voltage}
                  onChange={(e) => handleInputChange('voltage', parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={230}>230V</option>
                  <option value={400}>400V</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={calculatePerformance}
            disabled={loading}
            className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 disabled:opacity-50 font-medium"
          >
            {loading ? 'Analyse en cours...' : 'Analyser Performance'}
          </button>
        </div>
      </div>
      
      {/* Résultats */}
      {result && (
        <>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Résultats Analyse de Performance</h3>
            
            {result.warnings && result.warnings.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-yellow-800 mb-2">⚠️ Avertissements</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {result.warnings.map((warning, index) => (
                    <li key={index}>• {warning}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {result.recommendations && result.recommendations.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-blue-800 mb-2">💡 Recommandations</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  {result.recommendations.map((recommendation, index) => (
                    <li key={index}>• {recommendation}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700 border-b pb-2">Données Hydrauliques</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Vitesse:</span>
                    <span className="font-medium">{result.velocity?.toFixed(2)} m/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nombre de Reynolds:</span>
                    <span className="font-medium">{result.reynolds_number?.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Régime d'écoulement:</span>
                    <span className="font-medium">{result.reynolds_number > 4000 ? 'Turbulent' : result.reynolds_number > 2300 ? 'Transitoire' : 'Laminaire'}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700 border-b pb-2">Rendements</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Rendement pompe:</span>
                    <span className="font-medium">{result.pump_efficiency?.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rendement moteur:</span>
                    <span className="font-medium">{result.motor_efficiency?.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">Rendement global:</span>
                    <span className="font-bold">{result.overall_efficiency?.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Affichage des alertes */}
            {result.alerts && result.alerts.length > 0 && (
              <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-800 mb-2">🔔 Alertes Techniques</h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  {result.alerts.map((alert, index) => (
                    <li key={index}>• {alert}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700 border-b pb-2">Calculs Électriques</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Courant nominal:</span>
                    <span className="font-medium">{result.nominal_current?.toFixed(1)} A</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Courant démarrage:</span>
                    <span className="font-medium">{result.starting_current?.toFixed(1)} A</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Section de câble:</span>
                    <span className="font-medium">{result.recommended_cable_section?.toFixed(1)} mm²</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Méthode démarrage:</span>
                    <span className="font-medium">{result.electrical_data?.starting_method === 'star_delta' ? 'Étoile-Triangle' : 'Direct'}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700 border-b pb-2">Puissances</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Puissance hydraulique:</span>
                    <span className="font-medium">{result.power_calculations?.hydraulic_power?.toFixed(2)} kW</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Puissance absorbée:</span>
                    <span className="font-medium">{result.power_calculations?.absorbed_power?.toFixed(2)} kW</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tension:</span>
                    <span className="font-medium">{result.electrical_data?.voltage} V</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Facteur de puissance:</span>
                    <span className="font-medium">{result.electrical_data?.power_factor}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Meilleur point de fonctionnement */}
          {result.performance_curves && result.performance_curves.best_operating_point && (
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium text-gray-700 mb-3">🎯 Point de Fonctionnement (Valeurs Saisies)</h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-blue-800">{inputData.flow_rate}</div>
                    <div className="text-blue-600">Débit (m³/h)</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-blue-800">{inputData.hmt}</div>
                    <div className="text-blue-600">HMT (m)</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-blue-800">{inputData.pump_efficiency}</div>
                    <div className="text-blue-600">Rendement (%)</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-blue-800">{result.performance_curves.best_operating_point.power?.toFixed(2)}</div>
                    <div className="text-blue-600">Puissance (kW)</div>
                  </div>
                </div>
                <div className="mt-3 text-center text-xs text-blue-600">
                  Calculé avec formule P2 = ((Q × HMT) / (η × 367)) × 100 et pertes Darcy-Weisbach
                </div>
              </div>
            </div>
          )}
          
          {/* Graphiques des courbes de performance */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Courbes de Performance Hydraulique</h3>
            <canvas ref={chartRef} className="w-full h-96"></canvas>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Courbe de Puissance Absorbée</h3>
            <canvas ref={powerChartRef} className="w-full h-64"></canvas>
          </div>
        </>
      )}
    </div>
  );
};


const DrawingTool = () => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    installation_type: 'surface', suction_type: 'flooded',
    num_pumps: 1, num_standby: 0,
    // Forage
    Q_forage: 10, dynamic_level: 30, tank_height: 10, l_ref_forage: 80,
    residual_P_forage: 0.5, dn_ref_forage: 80, mat_forage: 'PEHD',
    // Relevage
    Q_relev: 30, h_ref_relev: 15, dn_relev: 80, l_ref_relev: 40,
    // Surface/Surpression/Incendie
    Q: 50, hasp: 3, h_geo: 25, l_asp: 20, dn_asp: 100, mat_asp: 'PVC',
    l_ref: 50, dn_ref: 80, mat_ref: 'Acier', residual_P: 0, npsh_req: 3.5,
    // Commun
    fluid: 'Eau', temperature: 20, pressure_max: 6,
    voltage: '400V - 50Hz', protection: 'IP65',
    project_name: 'Mon Installation', date: new Date().toLocaleDateString('fr-FR'),
  });
  const [acc, setAcc] = useState({
    manometre_asp: true, manometre_ref: true, debitmetre: false, capteur_P: false,
    vanne_asp: true, vanne_ref: true, clapet: true, soupape: false,
    crepine: true, joint_dil: false, vv: false, manifold: false,
    coffret: true, vfd: false, flotteur_h: true, flotteur_b: true,
  });
  const [ready, setReady] = useState(false);
  const set = (k,v) => setConfig(p => ({...p,[k]:v}));
  const tog = k => setAcc(p => ({...p,[k]:!p[k]}));
  const type = config.installation_type;

  const types = [
    {id:'surface',   label:'Surface / Bâche', icon:'🏗️', sub:true, max:4},
    {id:'surpression',label:'Surpression',     icon:'💨', sub:true, max:4},
    {id:'incendie',  label:'Incendie',         icon:'🔥', sub:true, max:2},
    {id:'relevage',  label:'Relevage',         icon:'⬆️', sub:false,max:3},
    {id:'forage',    label:'Forage / Puits',   icon:'🕳️', sub:false,max:1},
  ];
  const cur = types.find(t=>t.id===type)||types[0];
  const maxP = cur.max;

  // ── Calculs HMT ──
  const calc = (() => {
    const g=9.81, rho=1000;
    const Jdarcy = (Q,dn,L) => {
      if(!Q||!dn||!L) return 0;
      const A = Math.PI*(dn/1000/2)**2;
      const V = (Q/3600)/A;
      const Re = V*(dn/1000)/1e-6;
      const f = Re>2300 ? 0.316/Math.pow(Re,0.25) : 64/Math.max(Re,1);
      return f*(L/(dn/1000))*(V**2)/(2*g);
    };
    if(type==='forage') {
      const Hg = parseFloat(config.dynamic_level)+parseFloat(config.tank_height);
      const Jr = Jdarcy(config.Q_forage,config.dn_ref_forage,config.l_ref_forage);
      const HMT = Hg+Jr+config.residual_P_forage*1e5/(rho*g);
      const A = Math.PI*(config.dn_ref_forage/1000/2)**2;
      const V = (config.Q_forage/3600)/A;
      const Ph = rho*g*(config.Q_forage/3600)*HMT/1000;
      return {HMT:HMT.toFixed(1),Ph:Ph.toFixed(2),Pa:(Ph/0.65).toFixed(1),V:V.toFixed(2),Hg:Hg.toFixed(0),Jr:Jr.toFixed(2)};
    }
    if(type==='relevage') {
      const Jr = Jdarcy(config.Q_relev,config.dn_relev,config.l_ref_relev);
      const HMT = parseFloat(config.h_ref_relev)+Jr;
      const A = Math.PI*(config.dn_relev/1000/2)**2;
      const V = (config.Q_relev/3600)/A;
      const Ph = rho*g*(config.Q_relev/3600)*HMT/1000;
      return {HMT:HMT.toFixed(1),Ph:Ph.toFixed(2),Pa:(Ph/0.70).toFixed(1),V:V.toFixed(2),Jr:Jr.toFixed(2)};
    }
    const Ja = Jdarcy(config.Q,config.dn_asp,config.l_asp);
    const Jr = Jdarcy(config.Q,config.dn_ref,config.l_ref);
    const Aa = Math.PI*(config.dn_asp/1000/2)**2;
    const Ar = Math.PI*(config.dn_ref/1000/2)**2;
    const Va = (config.Q/3600)/Aa;
    const Vr = (config.Q/3600)/Ar;
    const HMT = parseFloat(config.h_geo)+Ja+Jr+config.residual_P*1e5/(rho*g);
    const Pa_atm = 101325/(rho*g);
    const Pv = 2338/(rho*g);
    const hs = config.suction_type==='flooded' ? parseFloat(config.hasp) : -parseFloat(config.hasp);
    const NPSHd = Pa_atm+hs-Pv-Ja;
    const Ph = rho*g*(config.Q/3600)*HMT/1000;
    return {HMT:HMT.toFixed(1),Ph:Ph.toFixed(2),Pa:(Ph/0.75).toFixed(1),Va:Va.toFixed(2),Vr:Vr.toFixed(2),Ja:Ja.toFixed(2),Jr:Jr.toFixed(2),NPSHd:NPSHd.toFixed(2),cav:NPSHd<config.npsh_req};
  })();

  const accDefs = [
    {label:'Instrumentation', color:'#3b82f6', items:[
      {k:'manometre_asp',l:'Manomètre Aspiration', t:['surface','surpression','incendie']},
      {k:'manometre_ref',l:'Manomètre Refoulement',t:['surface','surpression','incendie','relevage','forage']},
      {k:'debitmetre',   l:'Débitmètre',           t:['surface','surpression','incendie','relevage','forage']},
      {k:'capteur_P',    l:'Capteur Pression',     t:['surface','surpression','incendie']},
    ]},
    {label:'Vannes & Robinetterie', color:'#10b981', items:[
      {k:'vanne_asp', l:'Vanne Isolement Asp.', t:['surface','surpression','incendie']},
      {k:'vanne_ref', l:'Vanne Isolement Ref.', t:['surface','surpression','incendie','relevage','forage']},
      {k:'clapet',    l:'Clapet Anti-Retour',   t:['surface','surpression','incendie','relevage','forage']},
      {k:'soupape',   l:'Soupape Sécurité',     t:['surface','surpression','incendie']},
    ]},
    {label:'Équipements Mécaniques', color:'#f59e0b', items:[
      {k:'crepine', l:'Crépine / Filtre',   t:['surface','surpression','incendie','forage']},
      {k:'joint_dil',l:'Joint Dilatation',  t:['surface','surpression','incendie']},
      {k:'vv',      l:'Réservoir à Vessie', t:['surpression']},
      {k:'manifold',l:'Manifold Collecteur',t:['surface','surpression','incendie','relevage']},
    ]},
    {label:'Électrique & Régulation', color:'#8b5cf6', items:[
      {k:'coffret',   l:'Coffret Commande',    t:['surface','surpression','incendie','relevage','forage']},
      {k:'vfd',       l:'Variateur Fréquence', t:['surface','surpression']},
      {k:'flotteur_h',l:'Flotteur Haut',       t:['relevage']},
      {k:'flotteur_b',l:'Flotteur Bas',        t:['relevage']},
    ]},
  ];

  // ── HELPERS ──
  const F = ({label,k,unit,s=1,note}) => (
    <div>
      <label style={{display:'block',fontSize:'0.78rem',fontWeight:600,color:'#475569',marginBottom:'4px'}}>
        {label}{unit&&<span style={{color:'#94a3b8',fontWeight:400}}> ({unit})</span>}
      </label>
      <input type="number" value={config[k]} step={s}
        onChange={e=>set(k,parseFloat(e.target.value)||0)}
        style={{width:'100%',padding:'8px 11px',border:'1.5px solid #e2e8f0',borderRadius:'6px',fontSize:'0.875rem'}}/>
      {note&&<div style={{fontSize:'0.7rem',color:'#94a3b8',marginTop:'2px'}}>{note}</div>}
    </div>
  );
  const S = ({label,k,opts}) => (
    <div>
      <label style={{display:'block',fontSize:'0.78rem',fontWeight:600,color:'#475569',marginBottom:'4px'}}>{label}</label>
      <select value={config[k]} onChange={e=>set(k,e.target.value)}
        style={{width:'100%',padding:'8px 11px',border:'1.5px solid #e2e8f0',borderRadius:'6px',fontSize:'0.875rem',appearance:'none'}}>
        {opts.map(o=><option key={o}>{o}</option>)}
      </select>
    </div>
  );
  const Sec = ({t,c}) => (
    <div style={{fontWeight:700,fontSize:'0.78rem',color:c,borderBottom:`2px solid ${c}`,paddingBottom:'5px',marginBottom:'10px',marginTop:'14px',textTransform:'uppercase',letterSpacing:'0.05em'}}>{t}</div>
  );
  const RC = ({l,v,u,c='#059669',warn}) => (
    <div style={{background:'#f8fafc',border:`1.5px solid ${c}30`,borderRadius:'8px',padding:'10px',textAlign:'center',borderTop:`3px solid ${c}`}}>
      <div style={{fontSize:'1.3rem',fontWeight:800,color:c,fontFamily:'monospace'}}>{v}</div>
      <div style={{fontSize:'0.68rem',fontWeight:700,color:c}}>{u}</div>
      <div style={{fontSize:'0.68rem',color:'#64748b'}}>{l}</div>
      {warn&&<div style={{fontSize:'0.65rem',color:c,marginTop:'1px'}}>{warn}</div>}
    </div>
  );

  // ══════════════════════════════════════════
  // SVG FORAGE
  // ══════════════════════════════════════════
  const SvgForage = () => {
    const c=config; const a=acc;
    return (
    <svg width="100%" viewBox="0 0 800 500" id="hydraulic-schema" style={{display:'block',background:'white'}}>
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M1 1L9 5L1 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
        <pattern id="gr" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0L0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5"/>
        </pattern>
        <pattern id="ht" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#94a3b8" strokeWidth="1.5" opacity="0.4"/>
        </pattern>
      </defs>
      <rect width="800" height="420" fill="url(#gr)"/>
      {/* Sol */}
      <rect x="0" y="88" width="800" height="14" fill="url(#ht)"/>
      <line x1="0" y1="88" x2="800" y2="88" stroke="#78716c" strokeWidth="2"/>
      <text x="12" y="82" fontSize="11" fontWeight="700" fill="#78716c">Niveau du sol — 0.00 m</text>
      {/* Puits */}
      <rect x="200" y="88" width="120" height="302" rx="4" fill="#dbeafe" opacity="0.3" stroke="#1d4ed8" strokeWidth="2" strokeDasharray="8 4"/>
      <text x="260" y="78" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1d4ed8">FORAGE</text>
      {/* Niveau dynamique */}
      <rect x="202" y="248" width="116" height="140" rx="2" fill="#3b82f6" opacity="0.2"/>
      <line x1="195" y1="248" x2="325" y2="248" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="6 3"/>
      <text x="332" y="252" fontSize="10" fill="#2563eb" fontWeight="600">Niveau dynamique</text>
      {/* Cote Nd */}
      <line x1="185" y1="88" x2="185" y2="248" stroke="#ef4444" strokeWidth="1.2" markerEnd="url(#arr)" markerStart="url(#arr)"/>
      <text x="175" y="172" textAnchor="middle" fontSize="9" fill="#ef4444" fontWeight="700" transform="rotate(-90,175,172)">Nd = {c.dynamic_level} m</text>
      {/* Colonne montante */}
      <rect x="252" y="88" width="16" height="270" rx="2" fill="#475569"/>
      <text x="275" y="200" fontSize="8" fill="#64748b">colonne de refoulement</text>
      {/* Pompe immergée */}
      <rect x="225" y="330" width="70" height="55" rx="8" fill="#059669" stroke="#065f46" strokeWidth="2"/>
      <ellipse cx="260" cy="334" rx="24" ry="8" fill="#10b981" stroke="#065f46" strokeWidth="1.5"/>
      <text x="260" y="355" textAnchor="middle" fontSize="11" fontWeight="700" fill="white">POMPE</text>
      <text x="260" y="370" textAnchor="middle" fontSize="9" fill="#d1fae5">immergée</text>
      <text x="260" y="382" textAnchor="middle" fontSize="8" fill="#6ee7b7">IP68</text>
      {/* Moteur en dessous */}
      <rect x="233" y="385" width="54" height="30" rx="5" fill="#1e40af" stroke="#1e3a8a" strokeWidth="1.5"/>
      <text x="260" y="405" textAnchor="middle" fontSize="9" fontWeight="700" fill="white">MOTEUR</text>
      {/* Crépine */}
      {a.crepine && <><rect x="237" y="415" width="46" height="14" rx="3" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.2"/><text x="260" y="426" textAnchor="middle" fontSize="8" fontWeight="600" fill="#92400e">CRÉPINE</text></>}
      {/* Câble électrique */}
      <path d="M320 360 Q360 340 370 280 Q380 200 400 100" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 3"/>
      <text x="385" y="240" fontSize="9" fill="#d97706" fontWeight="600">câble élec.</text>
      {/* Tuyauterie en surface */}
      <line x1="260" y1="88" x2="260" y2="55" stroke="#1e293b" strokeWidth="10" strokeLinecap="round"/>
      <line x1="260" y1="55" x2="520" y2="55" stroke="#1e293b" strokeWidth="10" strokeLinecap="round"/>
      {/* Clapet */}
      {a.clapet && <><rect x="248" y="42" width="24" height="26" rx="4" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5"/><line x1="260" y1="42" x2="260" y2="68" stroke="#f59e0b" strokeWidth="1.5"/><text x="280" y="58" fontSize="9" fill="#b45309" fontWeight="600">clapet</text></>}
      {/* Vanne ref */}
      {a.vanne_ref && <><rect x="320" y="40" width="30" height="30" rx="5" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5"/><line x1="335" y1="40" x2="335" y2="70" stroke="#2563eb" strokeWidth="2"/><line x1="320" y1="55" x2="350" y2="55" stroke="#2563eb" strokeWidth="2"/><text x="335" y="82" textAnchor="middle" fontSize="8" fill="#1d4ed8">V.iso</text></>}
      {/* Manomètre */}
      {a.manometre_ref && <><circle cx="400" cy="40" r="12" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1.5"/><text x="400" y="44" textAnchor="middle" fontSize="9" fontWeight="700" fill="#166534">P</text><text x="400" y="26" textAnchor="middle" fontSize="8" fill="#166534">mano.</text></>}
      {/* Débitmètre */}
      {a.debitmetre && <><rect x="440" y="40" width="30" height="30" rx="5" fill="#ede9fe" stroke="#7c3aed" strokeWidth="1.5"/><text x="455" y="59" textAnchor="middle" fontSize="11" fontWeight="700" fill="#5b21b6">Q</text><text x="455" y="82" textAnchor="middle" fontSize="8" fill="#6d28d9">débit.</text></>}
      {/* Château d'eau */}
      <rect x="530" y="15" width="90" height="22" rx="4" fill="#dbeafe" stroke="#1d4ed8" strokeWidth="1.5"/>
      <rect x="540" y="37" width="70" height="70" rx="3" fill="#dbeafe" stroke="#1d4ed8" strokeWidth="1.5"/>
      <line x1="520" y1="55" x2="540" y2="55" stroke="#1e293b" strokeWidth="8" strokeLinecap="round"/>
      <line x1="540" y1="55" x2="540" y2="26" stroke="#1e293b" strokeWidth="8" strokeLinecap="round"/>
      <line x1="540" y1="26" x2="530" y2="26" stroke="#1e293b" strokeWidth="8" strokeLinecap="round"/>
      <line x1="555" y1="55" x2="575" y2="55" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 2"/>
      <text x="575" y="26" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1d4ed8">CHÂTEAU</text>
      <text x="575" y="40" textAnchor="middle" fontSize="10" fill="#1d4ed8">H = {c.tank_height} m</text>
      <text x="575" y="58" textAnchor="middle" fontSize="9" fill="#2563eb">niveau eau</text>
      {/* Cote château */}
      <line x1="648" y1="88" x2="648" y2="15" stroke="#ef4444" strokeWidth="1.2" markerEnd="url(#arr)" markerStart="url(#arr)"/>
      <text x="660" y="54" fontSize="9" fill="#ef4444" fontWeight="700">Hch={c.tank_height}m</text>
      {/* Flèche Q */}
      <line x1="390" y1="55" x2="485" y2="55" stroke="#10b981" strokeWidth="2" markerEnd="url(#arr)"/>
      <text x="437" y="46" textAnchor="middle" fontSize="9" fill="#059669" fontWeight="600">Q = {c.Q_forage} m³/h</text>
      {/* Coffret */}
      {a.coffret && <>
        <rect x="640" y="140" width="130" height="100" rx="8" fill="#1e1b4b" stroke="#4338ca" strokeWidth="2"/>
        <text x="705" y="170" textAnchor="middle" fontSize="13" fontWeight="700" fill="white">COFFRET</text>
        <text x="705" y="188" textAnchor="middle" fontSize="10" fill="#a5b4fc">commande</text>
        <text x="705" y="204" textAnchor="middle" fontSize="9" fill="#6366f1">{c.voltage}</text>
        <text x="705" y="218" textAnchor="middle" fontSize="9" fill="#4f46e5">{c.protection}</text>
        <path d="M640 175 Q560 175 400 105" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" markerEnd="url(#arr)"/>
        <text x="520" y="168" fontSize="8" fill="#d97706">alimentation</text>
      </>}
      {/* Calculs box */}
      <rect x="12" y="100" width="185" height="120" rx="6" fill="white" stroke="#e2e8f0" strokeWidth="1"/>
      <text x="22" y="118" fontSize="10" fontWeight="700" fill="#0f172a">Calculs automatiques :</text>
      <text x="22" y="134" fontSize="9" fill="#475569">Hgéo = Nd + Hch = {calc.Hg} m</text>
      <text x="22" y="148" fontSize="9" fill="#475569">J.ref = {calc.Jr} m</text>
      <text x="22" y="164" fontSize="11" fontWeight="800" fill="#059669">HMT = {calc.HMT} m</text>
      <text x="22" y="178" fontSize="9" fill="#7c3aed">Pa ≈ {calc.Pa} kW</text>
      <text x="22" y="192" fontSize="9" fill="#475569">V = {calc.V} m/s | DN {c.dn_ref_forage}mm</text>
      <text x="22" y="206" fontSize="9" fill="#475569">Matériau : {c.mat_forage}</text>
      {/* Cartouche */}
      {Cartouche({c,calc,type:'forage',acc:a,Q:c.Q_forage})}
    </svg>);
  };

  // ══════════════════════════════════════════
  // SVG RELEVAGE
  // ══════════════════════════════════════════
  const SvgRelevage = () => {
    const c=config; const a=acc;
    const np=c.num_pumps, ns=c.num_standby, tot=np+ns;
    const sp = tot <= 2 ? 160 : tot === 3 ? 130 : 110;
    const sx = Math.max(30, (800 - tot*sp) / 2);
    return (
    <svg width="100%" viewBox="0 0 800 500" id="hydraulic-schema" style={{display:'block',background:'white'}}>
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M1 1L9 5L1 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
        <pattern id="gr" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0L0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="800" height="420" fill="url(#gr)"/>
      {/* Bâche */}
      <rect x="12" y="260" width="160" height="120" rx="6" fill="#c7d2fe" stroke="#4338ca" strokeWidth="2"/>
      <rect x="14" y="290" width="156" height="88" rx="4" fill="#818cf8" opacity="0.25"/>
      <line x1="12" y1="290" x2="172" y2="290" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="5 3"/>
      <text x="92" y="252" textAnchor="middle" fontSize="12" fontWeight="700" fill="#3730a3">BÂCHE RELEVAGE</text>
      <text x="92" y="284" textAnchor="middle" fontSize="9" fill="#4338ca">niveau bas</text>
      <text x="92" y="350" textAnchor="middle" fontSize="9" fill="#6366f1">niveau haut</text>
      {/* Flotteurs */}
      {a.flotteur_h && <><circle cx="40" cy="287" r="9" fill="#22c55e" stroke="#15803d" strokeWidth="1.5"/><text x="40" y="291" textAnchor="middle" fontSize="8" fontWeight="700" fill="white">H</text><line x1="40" y1="296" x2="40" y2="340" stroke="#15803d" strokeWidth="1.2" strokeDasharray="3 2"/><text x="18" y="284" fontSize="8" fill="#15803d" fontWeight="600">flot.⬆</text></>}
      {a.flotteur_b && <><circle cx="70" cy="340" r="9" fill="#ef4444" stroke="#dc2626" strokeWidth="1.5"/><text x="70" y="344" textAnchor="middle" fontSize="8" fontWeight="700" fill="white">B</text><line x1="70" y1="331" x2="70" y2="295" stroke="#dc2626" strokeWidth="1.2" strokeDasharray="3 2"/><text x="82" y="346" fontSize="8" fill="#dc2626" fontWeight="600">flot.⬇</text></>}
      {/* Pompes */}
      {[...Array(tot)].map((_,i) => {
        const px = sx + i*sp;
        const stb = i >= np;
        return <g key={i}>
          {/* Aspiration depuis bâche */}
          <line x1="172" y1="305" x2={px+5} y2="305" stroke="#1e293b" strokeWidth="7" strokeLinecap="round"/>
          {/* Corps pompe */}
          <rect x={px} y="250" width="75" height="60" rx="8" fill={stb?'#f1f5f9':'#059669'} stroke={stb?'#94a3b8':'#065f46'} strokeWidth="2"/>
          <text x={px+37} y="275" textAnchor="middle" fontSize="12" fontWeight="700" fill={stb?'#64748b':'white'}>{stb?'SEC.':'P'+(i+1)}</text>
          <text x={px+37} y="291" textAnchor="middle" fontSize="9" fill={stb?'#94a3b8':'#d1fae5'}>{stb?'SECOURS':'RELEVAGE'}</text>
          {/* Moteur submersible */}
          <rect x={px+10} y="310" width="55" height="28" rx="5" fill={stb?'#e2e8f0':'#1e40af'} stroke={stb?'#94a3b8':'#1e3a8a'} strokeWidth="1.5"/>
          <text x={px+37} y="329" textAnchor="middle" fontSize="9" fontWeight="700" fill={stb?'#64748b':'white'}>MOTEUR</text>
          {/* Câble élec de la pompe */}
          <path d={`M${px+75} 290 Q${px+90} 270 ${px+85} 230`} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2"/>
          {/* Clapet */}
          {a.clapet && <><rect x={px+19} y="228" width="37" height="22" rx="4" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.2"/><text x={px+37} y="243" textAnchor="middle" fontSize="8" fontWeight="600" fill="#b45309">clapet</text></>}
          {/* Vanne ref */}
          {a.vanne_ref && <><rect x={px+20} y="195" width="34" height="30" rx="5" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5"/><line x1={px+37} y1="195" x2={px+37} y2="225" stroke="#2563eb" strokeWidth="2"/><line x1={px+20} y1="210" x2={px+54} y2="210" stroke="#2563eb" strokeWidth="2"/><text x={px+37} y="186" textAnchor="middle" fontSize="8" fill="#1d4ed8">V.iso</text></>}
          {/* Conduite refoulement individuelle */}
          <line x1={px+37} y1="195" x2={px+37} y2="100" stroke="#1e293b" strokeWidth="6" strokeLinecap="round"/>
        </g>;
      })}
      {/* Collecteur */}
      {tot>1 && <rect x={sx+37-10} y="95" width={(tot-1)*sp+20} height="10" rx="4" fill="#1e293b"/>}
      {/* Sortie */}
      {(()=>{
        const ox = tot>1 ? sx+(tot-1)*sp/2+37 : sx+37;
        return <>
          <line x1={ox} y1="95" x2={ox} y2="35" stroke="#1e293b" strokeWidth="8" strokeLinecap="round"/>
          {a.debitmetre && <><rect x={ox-16} y="60" width="32" height="26" rx="5" fill="#ede9fe" stroke="#7c3aed" strokeWidth="1.5"/><text x={ox} y="77" textAnchor="middle" fontSize="11" fontWeight="700" fill="#5b21b6">Q</text></>}
          {a.manometre_ref && <><circle cx={ox+28} cy="75" r="12" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1.5"/><text x={ox+28} y="79" textAnchor="middle" fontSize="9" fontWeight="700" fill="#166534">P</text></>}
          <line x1={ox} y1="80" x2={ox} y2="42" stroke="#10b981" strokeWidth="2.5" markerEnd="url(#arr)"/>
          <rect x={ox-30} y="18" width="60" height="20" rx="4" fill="#10b981" opacity="0.8"/>
          <text x={ox} y="32" textAnchor="middle" fontSize="10" fontWeight="700" fill="white">→ Réseau</text>
        </>;
      })()}
      {/* Coffret */}
      {a.coffret && <>
        <rect x="620" y="100" width="140" height="110" rx="8" fill="#1e1b4b" stroke="#4338ca" strokeWidth="2"/>
        <text x="690" y="130" textAnchor="middle" fontSize="13" fontWeight="700" fill="white">COFFRET</text>
        <text x="690" y="148" textAnchor="middle" fontSize="10" fill="#a5b4fc">commande</text>
        <text x="690" y="164" textAnchor="middle" fontSize="9" fill="#6366f1">{config.voltage}</text>
        <text x="690" y="178" textAnchor="middle" fontSize="8" fill="#4f46e5">{config.protection}</text>
        <text x="690" y="192" textAnchor="middle" fontSize="8" fill="#818cf8">RELEVAGE</text>
        {/* Câbles vers pompes */}
        {[...Array(tot)].map((_,i)=>{
          const px=sx+i*sp+37;
          return <path key={i} d={`M620 130 Q${px+80} 130 ${px+85} 230`} fill="none" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.7"/>;
        })}
        {/* Câbles flotteurs */}
        {a.flotteur_h && <path d="M620 150 Q400 150 49 287" fill="none" stroke="#22c55e" strokeWidth="1.2" strokeDasharray="4 2" markerEnd="url(#arr)"/>}
        {a.flotteur_b && <path d="M620 165 Q400 165 79 340" fill="none" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="4 2" markerEnd="url(#arr)"/>}
        <text x="690" y="220" textAnchor="middle" fontSize="8" fill="#f59e0b">━ câbles pompes</text>
        <text x="690" y="232" textAnchor="middle" fontSize="8" fill="#22c55e">━ flotteur haut</text>
        <text x="690" y="244" textAnchor="middle" fontSize="8" fill="#ef4444">━ flotteur bas</text>
      </>}
      {/* Info calculs */}
      <rect x="12" y="100" width="160" height="90" rx="6" fill="white" stroke="#e2e8f0" strokeWidth="1"/>
      <text x="22" y="118" fontSize="10" fontWeight="700" fill="#0f172a">Calculs :</text>
      <text x="22" y="133" fontSize="9" fill="#475569">J.ref = {calc.Jr} m</text>
      <text x="22" y="148" fontSize="11" fontWeight="800" fill="#059669">HMT = {calc.HMT} m</text>
      <text x="22" y="163" fontSize="9" fill="#7c3aed">Pa = {calc.Pa} kW</text>
      <text x="22" y="177" fontSize="9" fill="#475569">V = {calc.V} m/s</text>
      {Cartouche({c,calc,type:'relevage',acc:a,Q:c.Q_relev})}
    </svg>);
  };

  // ══════════════════════════════════════════
  // SVG SURFACE / SURPRESSION / INCENDIE
  // ══════════════════════════════════════════
  const SvgSurface = () => {
    const c=config; const a=acc;
    const np=c.num_pumps, ns=c.num_standby, tot=np+ns;
    const isC=c.suction_type==='flooded', isL=c.suction_type==='level';
    const sp = tot<=2?140:tot===3?115:100;
    const sx = 230;
    const pY = isC ? 230 : isL ? 240 : 170;
    const aspY = isC ? 195 : pY+25;
    const tc = type==='incendie'?'#dc2626':type==='surpression'?'#7c3aed':'#059669';
    const tb = type==='incendie'?'#fef2f2':type==='surpression'?'#f5f3ff':'#f0fdf4';

    return (
    <svg width="100%" viewBox="0 0 800 500" id="hydraulic-schema" style={{display:'block',background:'white'}}>
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M1 1L9 5L1 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
        <pattern id="gr" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0L0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="800" height="420" fill="url(#gr)"/>

      {/* ── SOURCE ── */}
      {isC ? <>
        {/* Réservoir surélevé */}
        <rect x="12" y="100" width="150" height="180" rx="6" fill="#dbeafe" stroke="#1d4ed8" strokeWidth="2"/>
        <rect x="14" y="130" width="146" height="148" rx="4" fill="#3b82f6" opacity="0.25"/>
        <line x1="12" y1="130" x2="162" y2="130" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="5 3"/>
        <text x="87" y="90" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1d4ed8">RÉSERVOIR</text>
        <text x="87" y="124" textAnchor="middle" fontSize="9" fill="#2563eb">niveau eau</text>
        {/* Piédestal */}
        <rect x="72" y="280" width="30" height="100" rx="2" fill="#94a3b8" opacity="0.4"/>
        {/* Cote géo */}
        <line x1="6" y1="130" x2="6" y2={aspY} stroke="#ef4444" strokeWidth="1.2" markerEnd="url(#arr)" markerStart="url(#arr)"/>
        <text x="-2" y={(130+aspY)/2} textAnchor="middle" fontSize="8" fill="#ef4444" fontWeight="700" transform={`rotate(-90,-2,${(130+aspY)/2})`}>H.geo={c.h_geo}m</text>
        {/* Tuyau aspiration */}
        <line x1="162" y1={aspY} x2={sx-50} y2={aspY} stroke="#1e293b" strokeWidth="8" strokeLinecap="round"/>
      </> : isL ? <>
        {/* Bâche niveau égal */}
        <rect x="12" y="220" width="150" height="140" rx="6" fill="#dbeafe" stroke="#1d4ed8" strokeWidth="2"/>
        <rect x="14" y="250" width="146" height="108" rx="4" fill="#3b82f6" opacity="0.25"/>
        <line x1="12" y1="250" x2="162" y2="250" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="5 3"/>
        <text x="87" y="210" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1d4ed8">BÂCHE</text>
        <text x="87" y="244" textAnchor="middle" fontSize="9" fill="#2563eb">niveau eau</text>
        <line x1="162" y1="270" x2={sx-50} y2="270" stroke="#1e293b" strokeWidth="8" strokeLinecap="round"/>
        <line x1={sx-50} y1="270" x2={sx-50} y2={aspY} stroke="#1e293b" strokeWidth="8" strokeLinecap="round"/>
      </> : <>
        {/* Bâche en dépression */}
        <rect x="12" y="280" width="150" height="100" rx="6" fill="#dbeafe" stroke="#1d4ed8" strokeWidth="2"/>
        <rect x="14" y="305" width="146" height="73" rx="4" fill="#3b82f6" opacity="0.25"/>
        <line x1="12" y1="305" x2="162" y2="305" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="5 3"/>
        <text x="87" y="270" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1d4ed8">BÂCHE</text>
        <text x="87" y="299" textAnchor="middle" fontSize="9" fill="#2563eb">niveau eau</text>
        <line x1="162" y1="318" x2={sx-50} y2="318" stroke="#1e293b" strokeWidth="8" strokeLinecap="round"/>
        <line x1={sx-50} y1="318" x2={sx-50} y2={aspY} stroke="#1e293b" strokeWidth="8" strokeLinecap="round"/>
        {/* Cote Hasp */}
        <line x1="6" y1={aspY} x2="6" y2="305" stroke="#ef4444" strokeWidth="1.2" markerEnd="url(#arr)" markerStart="url(#arr)"/>
        <text x="-2" y={(aspY+305)/2} textAnchor="middle" fontSize="8" fill="#ef4444" fontWeight="700" transform={`rotate(-90,-2,${(aspY+305)/2})`}>Hasp={c.hasp}m</text>
      </>}

      {/* Crépine */}
      {a.crepine && isC && <><rect x={sx-62} y={aspY-10} width="18" height="20" rx="2" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1"/><text x={sx-53} y={aspY+24} textAnchor="middle" fontSize="8" fill="#b45309">crép.</text></>}
      {/* Vanne aspiration */}
      {a.vanne_asp && <><rect x={sx-52} y={aspY-14} width="30" height="28" rx="5" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5"/><line x1={sx-37} y1={aspY-14} x2={sx-37} y2={aspY+14} stroke="#2563eb" strokeWidth="2"/><line x1={sx-52} y1={aspY} x2={sx-22} y2={aspY} stroke="#2563eb" strokeWidth="2"/><text x={sx-37} y={aspY+27} textAnchor="middle" fontSize="8" fill="#1d4ed8">V.asp</text></>}
      {/* Manomètre aspiration */}
      {a.manometre_asp && <><circle cx={sx-8} cy={aspY-16} r="11" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1.5"/><text x={sx-8} y={aspY-12} textAnchor="middle" fontSize="9" fontWeight="700" fill="#166534">P</text></>}
      {/* NPSHd */}
      {calc.NPSHd && <><rect x={sx-55} y={aspY+35} width="100" height="32" rx="5" fill={calc.cav?'#fee2e2':'#f0fdf4'} stroke={calc.cav?'#fca5a5':'#86efac'} strokeWidth="1"/><text x={sx-5} y={aspY+49} textAnchor="middle" fontSize="9" fontWeight="700" fill={calc.cav?'#dc2626':'#16a34a'}>NPSHd={calc.NPSHd}m {calc.cav?'⚠':'✓'}</text><text x={sx-5} y={aspY+62} textAnchor="middle" fontSize="8" fill={calc.cav?'#dc2626':'#16a34a'}>{calc.cav?'RISQUE CAVITATION':'OK — pas de cavitation'}</text></>}

      {/* POMPES */}
      {[...Array(tot)].map((_,i)=>{
        const px=sx+i*sp; const stb=i>=np;
        return <g key={i}>
          <line x1={sx-22} y1={aspY} x2={px} y2={aspY} stroke="#1e293b" strokeWidth="7" strokeLinecap="round"/>
          {/* Corps */}
          <rect x={px} y={pY} width="75" height="55" rx="8" fill={stb?tb:tc} stroke={stb?'#94a3b8':tc} strokeWidth="2"/>
          <text x={px+37} y={pY+24} textAnchor="middle" fontSize="12" fontWeight="700" fill={stb?'#64748b':'white'}>{stb?'SEC.':'P'+(i+1)}</text>
          <text x={px+37} y={pY+40} textAnchor="middle" fontSize="9" fill={stb?'#94a3b8':'white'}>{type==='incendie'?'INC.':type==='surpression'?'SURPR.':'SERV.'}</text>
          {/* Moteur */}
          <ellipse cx={px+37} cy={pY-18} rx="25" ry="16" fill={stb?'#e2e8f0':'#1e40af'} stroke={stb?'#94a3b8':'#1e3a8a'} strokeWidth="1.5"/>
          <text x={px+37} y={pY-13} textAnchor="middle" fontSize="11" fontWeight="700" fill={stb?'#64748b':'white'}>M</text>
          <text x={px+37} y={pY-34} textAnchor="middle" fontSize="8" fill="#64748b">≈{(parseFloat(calc.Pa||0)/Math.max(np,1)).toFixed(1)}kW</text>
          {/* Vanne ref */}
          {a.vanne_ref && <><rect x={px+80} y={pY+13} width="30" height="30" rx="5" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5"/><line x1={px+95} y1={pY+13} x2={px+95} y2={pY+43} stroke="#2563eb" strokeWidth="2"/><line x1={px+80} y1={pY+28} x2={px+110} y2={pY+28} stroke="#2563eb" strokeWidth="2"/></>}
          {/* Clapet */}
          {a.clapet && <><rect x={px+112} y={pY+15} width="24" height="24" rx="4" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5"/><text x={px+124} y={pY+31} textAnchor="middle" fontSize="9" fontWeight="700" fill="#b45309">CA</text></>}
          {/* Mano ref */}
          {a.manometre_ref && <><circle cx={px+37} cy={pY+70} r="11" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1.5"/><text x={px+37} y={pY+74} textAnchor="middle" fontSize="9" fontWeight="700" fill="#166534">P</text></>}
          {/* Sortie individuelle */}
          <line x1={px+138} y1={pY+28} x2={px+155} y2={pY+28} stroke="#1e293b" strokeWidth="6" strokeLinecap="round"/>
        </g>;
      })}

      {/* Collecteur + sortie */}
      {(()=>{
        const lastX = sx+(tot-1)*sp+155;
        const cY = pY+28;
        const outX = tot>1 ? sx+(tot-1)*sp/2+155 : sx+155;
        return <>
          {tot>1 && <line x1={sx+155} y1={cY} x2={lastX} y2={cY} stroke="#1e293b" strokeWidth="7" strokeLinecap="round"/>}
          <line x1={outX} y1={cY} x2={outX} y2="35" stroke="#1e293b" strokeWidth="8" strokeLinecap="round"/>
          {a.debitmetre && <><rect x={outX-16} y="80" width="32" height="28" rx="5" fill="#ede9fe" stroke="#7c3aed" strokeWidth="1.5"/><text x={outX} y="98" textAnchor="middle" fontSize="11" fontWeight="700" fill="#5b21b6">Q</text></>}
          {a.vv && <><ellipse cx={outX+38} cy="120" rx="26" ry="18" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5"/><text x={outX+38} y="124" textAnchor="middle" fontSize="9" fontWeight="700" fill="#92400e">VV</text><line x1={outX} y1="120" x2={outX+12} y2="120" stroke="#f59e0b" strokeWidth="1.5"/></>}
          {a.capteur_P && <><rect x={outX+16} y="72" width="22" height="22" rx="4" fill="#fce7f3" stroke="#db2777" strokeWidth="1.5"/><text x={outX+27} y="87" textAnchor="middle" fontSize="9" fontWeight="700" fill="#9d174d">CP</text></>}
          {a.soupape && <><circle cx={outX-28} cy="110" r="13" fill="#fee2e2" stroke="#dc2626" strokeWidth="1.5"/><text x={outX-28} y="114" textAnchor="middle" fontSize="9" fontWeight="700" fill="#dc2626">SV</text></>}
          <line x1={outX} y1="95" x2={outX} y2="42" stroke="#10b981" strokeWidth="2.5" markerEnd="url(#arr)"/>
          <rect x={outX-35} y="18" width="70" height="22" rx="5" fill="#10b981" opacity="0.85"/>
          <text x={outX} y="33" textAnchor="middle" fontSize="11" fontWeight="700" fill="white">→ Réseau</text>
          <text x={outX} y="12" textAnchor="middle" fontSize="9" fill="#64748b">Q={c.Q}m³/h | P={calc.Pa}kW</text>
        </>;
      })()}

      {/* Coffret */}
      {a.coffret && <>
        <rect x="630" y="80" width="140" height="110" rx="8" fill="#1e1b4b" stroke="#4338ca" strokeWidth="2"/>
        <text x="700" y="110" textAnchor="middle" fontSize="13" fontWeight="700" fill="white">COFFRET</text>
        <text x="700" y="128" textAnchor="middle" fontSize="10" fill="#a5b4fc">commande</text>
        <text x="700" y="144" textAnchor="middle" fontSize="9" fill="#6366f1">{config.voltage}</text>
        <text x="700" y="160" textAnchor="middle" fontSize="8" fill="#4f46e5">{config.protection}</text>
        <text x="700" y="176" textAnchor="middle" fontSize="8" fill="#818cf8">{type.toUpperCase()}</text>
        {a.vfd && <><rect x="630" y="200" width="140" height="40" rx="6" fill="#312e81" stroke="#4338ca" strokeWidth="1.5"/><text x="700" y="218" textAnchor="middle" fontSize="11" fontWeight="700" fill="white">VFD</text><text x="700" y="232" textAnchor="middle" fontSize="9" fill="#a5b4fc">variateur fréq.</text></>}
      </>}

      {/* Info calculs */}
      <rect x="12" y="100" width="195" height="130" rx="6" fill="white" stroke="#e2e8f0" strokeWidth="1"/>
      <text x="22" y="118" fontSize="10" fontWeight="700" fill="#0f172a">Calculs automatiques :</text>
      <text x="22" y="133" fontSize="9" fill="#475569">J.asp={calc.Ja}m | J.ref={calc.Jr}m</text>
      <text x="22" y="147" fontSize="9" fill="#475569">Va={calc.Va}m/s | Vr={calc.Vr}m/s</text>
      <text x="22" y="162" fontSize="11" fontWeight="800" fill="#059669">HMT = {calc.HMT} m</text>
      <text x="22" y="176" fontSize="9" fill="#7c3aed">Pa ≈ {calc.Pa} kW</text>
      <text x="22" y="190" fontSize="9" fill={calc.cav?'#dc2626':'#16a34a'}>NPSHd = {calc.NPSHd} m {calc.cav?'⚠ CAVITATION':'✓ OK'}</text>
      <text x="22" y="204" fontSize="9" fill="#475569">H.géo = {c.h_geo} m</text>
      <text x="22" y="218" fontSize="9" fill="#475569">Fluide: {c.fluid} — {c.temperature}°C</text>

      {Cartouche({c,calc,type,acc:a,Q:c.Q})}
    </svg>);
  };

  const Cartouche = ({c,calc,type,acc,Q}) => (
    <g>
      <rect x="0" y="420" width="800" height="80" fill="#1e293b"/>
      <line x1="0" y1="420" x2="800" y2="420" stroke="#14b8a6" strokeWidth="2"/>
      <text x="12" y="440" fontSize="10" fontWeight="700" fill="#14b8a6">INSTALLATION</text>
      <text x="12" y="454" fontSize="10" fill="white">{type.toUpperCase()}</text>
      <text x="12" y="468" fontSize="9" fill="#94a3b8">{c.num_pumps} serv. + {c.num_standby} sec.</text>
      <text x="12" y="482" fontSize="9" fill="#64748b">{c.fluid} — {c.temperature}°C</text>
      <line x1="190" y1="428" x2="190" y2="492" stroke="#334155" strokeWidth="0.8"/>
      <text x="202" y="440" fontSize="10" fontWeight="700" fill="#14b8a6">HYDRAULIQUE</text>
      <text x="202" y="454" fontSize="10" fill="white">Q: {Q} m³/h</text>
      <text x="202" y="468" fontSize="10" fill="white">HMT: {calc.HMT} m</text>
      <text x="202" y="482" fontSize="10" fill="#22c55e" fontWeight="700">Pa: {calc.Pa} kW</text>
      <line x1="380" y1="428" x2="380" y2="492" stroke="#334155" strokeWidth="0.8"/>
      <text x="392" y="440" fontSize="10" fontWeight="700" fill="#14b8a6">TUYAUTERIES</text>
      <text x="392" y="454" fontSize="10" fill="white">DN Ref: {type==='forage'?c.dn_ref_forage:type==='relevage'?c.dn_relev:c.dn_ref}mm — {type==='forage'?c.mat_forage:type==='relevage'?'Acier':c.mat_ref}</text>
      {type!=='forage'&&type!=='relevage'&&<text x="392" y="468" fontSize="10" fill="white">DN Asp: {c.dn_asp}mm — {c.mat_asp}</text>}
      <line x1="570" y1="428" x2="570" y2="492" stroke="#334155" strokeWidth="0.8"/>
      <text x="582" y="440" fontSize="10" fontWeight="700" fill="#14b8a6">SPÉCIFICATIONS</text>
      <text x="582" y="454" fontSize="10" fill="white">{c.voltage}</text>
      <text x="582" y="468" fontSize="10" fill="white">{c.protection}</text>
      <text x="582" y="482" fontSize="9" fill="#94a3b8">Acc: {Object.values(acc).filter(Boolean).length} équip.</text>
      <line x1="700" y1="428" x2="700" y2="492" stroke="#334155" strokeWidth="0.8"/>
      <text x="712" y="444" fontSize="10" fontWeight="700" fill="white">ECO-PUMP</text>
      <text x="712" y="458" fontSize="9" fill="#14b8a6">AFRIK</text>
      <text x="712" y="472" fontSize="8" fill="#64748b">{c.project_name}</text>
      <text x="712" y="486" fontSize="8" fill="#64748b">{c.date}</text>
      <text x="6" y="498" fontSize="7" fill="#475569">Conformité: ISO 14692, NF EN 806, DTU 60.11 | Expert Hydraulique IA v4.0 | {c.date}</text>
    </g>
  );

  const renderSchema = () => {
    if(type==='forage') return <SvgForage/>;
    if(type==='relevage') return <SvgRelevage/>;
    return <SvgSurface/>;
  };

  const handlePrint = () => {
    const el = document.getElementById('hydraulic-schema');
    if(!el) return;
    const svg = new XMLSerializer().serializeToString(el);
    const w = window.open('','_blank');
    w.document.write(`<!DOCTYPE html><html><head><title>Schéma — ${config.project_name}</title>
    <style>body{margin:0;padding:16px;background:white;font-family:Arial}h2{font-size:15px;color:#1e293b;margin:0 0 4px}p{font-size:10px;color:#64748b;margin:0 0 12px}svg{width:100%;max-width:1000px;height:auto;border:1px solid #e2e8f0}@media print{body{padding:6px}@page{size:A4 landscape;margin:8mm}}</style>
    </head><body><h2>Schéma Hydraulique — ${config.project_name}</h2><p>ECO-PUMP AFRIK | v4.0 | ${config.date}</p>${svg}<script>window.onload=()=>window.print()<\/script></body></html>`);
    w.document.close();
  };

  const standbyOpts = [0,1,2].filter(n=>n+config.num_pumps<=maxP);

  return (
    <div className="fade-in" style={{display:'flex',flexDirection:'column',gap:'18px'}}>
      {/* Header */}
      <div style={{background:'linear-gradient(135deg,#0f172a,#1e293b)',borderRadius:'14px',padding:'24px 28px',color:'white',border:'1px solid rgba(20,184,166,0.2)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',right:'20px',top:'12px',fontSize:'70px',opacity:0.05}}>📐</div>
        <div style={{fontSize:'0.68rem',fontWeight:700,letterSpacing:'0.14em',color:'#14b8a6',textTransform:'uppercase',marginBottom:'5px'}}>Outil Professionnel</div>
        <h2 style={{fontSize:'1.4rem',fontWeight:800,marginBottom:'5px'}}>⚙️ Générateur de Schéma Hydraulique</h2>
        <p style={{color:'rgba(255,255,255,0.45)',fontSize:'0.82rem',margin:0}}>Calculs auto | Schéma temps réel | Export PDF | ISO-EN-DTU</p>
        <div style={{display:'flex',gap:'8px',marginTop:'10px',flexWrap:'wrap'}}>
          {['✅ HMT auto','📐 NPSHd','🖨️ PDF','🔖 ISO 14692'].map(b=>(
            <span key={b} style={{background:'rgba(20,184,166,0.12)',border:'1px solid rgba(20,184,166,0.25)',color:'#2dd4bf',padding:'3px 10px',borderRadius:'20px',fontSize:'0.68rem',fontWeight:700}}>{b}</span>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div style={{display:'flex',background:'white',borderRadius:'10px',border:'1px solid #e2e8f0',overflow:'hidden'}}>
        {['Type','Données','Accessoires','Schéma'].map((s,i)=>(
          <div key={i} onClick={()=>setStep(i+1)} style={{flex:1,padding:'10px 6px',textAlign:'center',cursor:'pointer',borderRight:i<3?'1px solid #e2e8f0':'none',background:step===i+1?'#f0fdfa':'white',borderBottom:step===i+1?'3px solid #14b8a6':'3px solid transparent'}}>
            <div style={{fontSize:'0.62rem',fontWeight:700,color:step===i+1?'#0f766e':'#94a3b8',textTransform:'uppercase',letterSpacing:'0.05em'}}>Étape {i+1}</div>
            <div style={{fontSize:'0.82rem',fontWeight:600,color:step===i+1?'#134e4a':'#64748b'}}>{s}</div>
          </div>
        ))}
      </div>

      {/* STEP 1 */}
      {step===1 && (
        <div className="card">
          <div className="card-header"><div className="card-title">🏗️ Type d'installation</div></div>
          <div className="card-body">
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:'10px',marginBottom:'20px'}}>
              {types.map(t=>(
                <div key={t.id} onClick={()=>{set('installation_type',t.id);if(!t.sub)set('suction_type','flooded');}}
                  style={{border:`2px solid ${config.installation_type===t.id?'#14b8a6':'#e2e8f0'}`,borderRadius:'10px',padding:'14px 10px',cursor:'pointer',textAlign:'center',background:config.installation_type===t.id?'#f0fdfa':'white',transition:'all 0.15s'}}>
                  <div style={{fontSize:'1.8rem',marginBottom:'6px'}}>{t.icon}</div>
                  <div style={{fontWeight:700,fontSize:'0.82rem',color:config.installation_type===t.id?'#0f766e':'#1e293b'}}>{t.label}</div>
                  <div style={{fontSize:'0.65rem',color:'#64748b',marginTop:'3px'}}>Max {t.max} pompe{t.max>1?'s':''}</div>
                </div>
              ))}
            </div>
            {cur.sub && (
              <div style={{marginBottom:'18px'}}>
                <div style={{fontWeight:700,marginBottom:'10px',fontSize:'0.88rem'}}>Type d'aspiration</div>
                <div style={{display:'flex',gap:'10px'}}>
                  {[{id:'flooded',l:'① En charge',d:'Réservoir surélevé',c:'#16a34a',bg:'#dcfce7'},
                    {id:'level',  l:'② Niveau égal',d:'Réservoir au sol',  c:'#b45309',bg:'#fef9c3'},
                    {id:'suction_lift',l:'③ En dépression',d:'Pompe surélevée',c:'#dc2626',bg:'#fee2e2'}
                  ].map(s=>(
                    <div key={s.id} onClick={()=>set('suction_type',s.id)}
                      style={{flex:1,border:`2px solid ${config.suction_type===s.id?s.c:'#e2e8f0'}`,borderRadius:'8px',padding:'10px',cursor:'pointer',background:config.suction_type===s.id?s.bg:'white'}}>
                      <div style={{fontWeight:700,fontSize:'0.82rem',color:config.suction_type===s.id?s.c:'#1e293b'}}>{s.l}</div>
                      <div style={{fontSize:'0.72rem',color:'#64748b'}}>{s.d}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
              <div>
                <label style={{display:'block',fontWeight:600,fontSize:'0.8rem',marginBottom:'6px'}}>Pompes en service</label>
                <select value={config.num_pumps} onChange={e=>{const v=parseInt(e.target.value);set('num_pumps',v);if(config.num_standby+v>maxP)set('num_standby',0);}}
                  style={{width:'100%',padding:'9px 12px',border:'1.5px solid #e2e8f0',borderRadius:'6px',fontSize:'0.875rem',appearance:'none'}}>
                  {[...Array(maxP)].map((_,i)=><option key={i+1} value={i+1}>{i+1} pompe{i>0?'s':''} en service</option>)}
                </select>
              </div>
              {type!=='forage' && (
                <div>
                  <label style={{display:'block',fontWeight:600,fontSize:'0.8rem',marginBottom:'6px'}}>Pompes de secours</label>
                  <select value={config.num_standby} onChange={e=>set('num_standby',parseInt(e.target.value))}
                    style={{width:'100%',padding:'9px 12px',border:'1.5px solid #e2e8f0',borderRadius:'6px',fontSize:'0.875rem',appearance:'none'}}>
                    {standbyOpts.map(n=><option key={n} value={n}>{n} pompe{n>1?'s':''} de secours</option>)}
                  </select>
                </div>
              )}
            </div>
            <div style={{background:'#f0fdfa',border:'1px solid #99f6e4',borderRadius:'10px',padding:'12px',marginTop:'14px',fontSize:'0.85rem'}}>
              <strong style={{color:'#0f766e'}}>{cur.label}</strong>
              {cur.sub&&<span style={{color:'#0d9488'}}> — {config.suction_type==='flooded'?'En charge':config.suction_type==='level'?'Niveau égal':'En dépression'}</span>}
              <span style={{color:'#64748b'}}> | {config.num_pumps} serv. + {config.num_standby} sec.</span>
            </div>
            <button onClick={()=>setStep(2)} style={{marginTop:'16px',width:'100%',background:'linear-gradient(135deg,#14b8a6,#0f766e)',color:'white',padding:'12px',borderRadius:'10px',border:'none',cursor:'pointer',fontWeight:700,fontSize:'0.95rem'}}>
              Suivant → Données système
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step===2 && (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
          <div className="card">
            <div className="card-header"><div className="card-title">⚙️ {cur.label} — Données</div></div>
            <div className="card-body" style={{display:'flex',flexDirection:'column',gap:'11px'}}>
              {type==='forage' && <>
                <Sec t="Hydraulique forage" c="#1d4ed8"/>
                <F label="Débit de pompage" k="Q_forage" unit="m³/h" note="Débit de la pompe immergée"/>
                <F label="Niveau dynamique" k="dynamic_level" unit="m" note="Profondeur de l'eau en pompage"/>
                <F label="Hauteur château d'eau" k="tank_height" unit="m" note="Hauteur de refoulement final"/>
                <F label="Longueur refoulement" k="l_ref_forage" unit="m"/>
                <F label="Pression résiduelle" k="residual_P_forage" unit="bar" s={0.1}/>
                <Sec t="Tuyauterie" c="#059669"/>
                <F label="DN refoulement" k="dn_ref_forage" unit="mm"/>
                <S label="Matériau" k="mat_forage" opts={['PEHD','PVC','Acier inox','Acier galvanisé']}/>
              </>}
              {type==='relevage' && <>
                <Sec t="Hydraulique relevage" c="#4338ca"/>
                <F label="Débit unitaire" k="Q_relev" unit="m³/h" note="Débit par pompe en service"/>
                <F label="Hauteur de refoulement" k="h_ref_relev" unit="m" note="Hauteur géométrique totale"/>
                <F label="Longueur refoulement" k="l_ref_relev" unit="m"/>
                <Sec t="Tuyauterie" c="#059669"/>
                <F label="DN refoulement" k="dn_relev" unit="mm"/>
              </>}
              {(type==='surface'||type==='surpression'||type==='incendie') && <>
                <Sec t="Hydraulique" c="#059669"/>
                <F label="Débit total" k="Q" unit="m³/h"/>
                <F label="Hauteur géométrique" k="h_geo" unit="m" note="Différence de niveau source → livraison"/>
                <F label="Hasp — hauteur aspiration" k="hasp" unit="m" note={config.suction_type==='flooded'?'Hauteur eau au-dessus pompe':'Hauteur de levée (max ~7m)'}/>
                <F label="Pression résiduelle" k="residual_P" unit="bar" s={0.1}/>
                <S label="Fluide pompé" k="fluid" opts={['Eau','Eau de mer','Eaux usées','Eaux chargées','Huile hydraulique','Diesel','Huile de palme','Glycol']}/>
                <F label="Température" k="temperature" unit="°C"/>
                <Sec t="Aspiration" c="#2563eb"/>
                <F label="DN aspiration" k="dn_asp" unit="mm"/>
                <F label="Longueur aspiration" k="l_asp" unit="m"/>
                <S label="Matériau aspiration" k="mat_asp" opts={['PVC','PEHD','Acier','Fonte','Acier inox']}/>
                <F label="NPSH requis (constructeur)" k="npsh_req" unit="m" s={0.1}/>
                <Sec t="Refoulement" c="#0891b2"/>
                <F label="DN refoulement" k="dn_ref" unit="mm"/>
                <F label="Longueur refoulement" k="l_ref" unit="m"/>
                <S label="Matériau refoulement" k="mat_ref" opts={['Acier','PVC','PEHD','Fonte','Acier inox','Acier galvanisé']}/>
              </>}
              <Sec t="Électrique" c="#8b5cf6"/>
              <S label="Tension réseau" k="voltage" opts={['400V - 50Hz','230V - 50Hz','220V - 60Hz','380V - 50Hz']}/>
              <S label="Protection IP" k="protection" opts={['IP55','IP65','IP68']}/>
              <div>
                <label style={{display:'block',fontSize:'0.78rem',fontWeight:600,color:'#475569',marginBottom:'4px'}}>Nom du projet</label>
                <input type="text" value={config.project_name} onChange={e=>set('project_name',e.target.value)}
                  style={{width:'100%',padding:'8px 11px',border:'1.5px solid #e2e8f0',borderRadius:'6px',fontSize:'0.875rem'}}/>
              </div>
              <div style={{display:'flex',gap:'10px',marginTop:'6px'}}>
                <button onClick={()=>setStep(1)} style={{flex:1,padding:'10px',border:'1.5px solid #e2e8f0',borderRadius:'8px',cursor:'pointer',fontWeight:600,background:'white'}}>← Retour</button>
                <button onClick={()=>setStep(3)} style={{flex:2,background:'linear-gradient(135deg,#14b8a6,#0f766e)',color:'white',padding:'10px',borderRadius:'8px',border:'none',cursor:'pointer',fontWeight:700}}>Accessoires →</button>
              </div>
            </div>
          </div>
          {/* Résultats + aperçu */}
          <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
            <div className="card">
              <div className="card-header"><div className="card-title">📊 Résultats calculés</div></div>
              <div className="card-body" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
                <RC l="HMT totale" v={calc.HMT} u="m" c="#059669"/>
                <RC l="Puissance absorbée" v={calc.Pa} u="kW" c="#7c3aed"/>
                <RC l="Puissance hydraulique" v={calc.Ph} u="kW" c="#0891b2"/>
                {calc.Va&&<RC l="V. aspiration" v={calc.Va} u="m/s" c={parseFloat(calc.Va)>1.5?'#f59e0b':'#059669'} warn={parseFloat(calc.Va)>1.5?'⚠ > 1.5 m/s':'✓ OK'}/>}
                {calc.Vr&&<RC l="V. refoulement" v={calc.Vr} u="m/s" c={parseFloat(calc.Vr)>2.5?'#f59e0b':'#059669'} warn={parseFloat(calc.Vr)>2.5?'⚠ > 2.5 m/s':'✓ OK'}/>}
                {calc.V&&<RC l="Vitesse écoul." v={calc.V} u="m/s" c="#059669"/>}
                {calc.NPSHd&&<RC l="NPSHd" v={calc.NPSHd} u="m" c={calc.cav?'#dc2626':'#059669'} warn={calc.cav?'⚠ CAVITATION':'✓ Sécurité OK'}/>}
                {calc.Jr&&<RC l="J. ref" v={calc.Jr} u="m" c="#64748b"/>}
                {calc.Ja&&<RC l="J. asp" v={calc.Ja} u="m" c="#64748b"/>}
                {calc.Hg&&<RC l="H. géométrique" v={calc.Hg} u="m" c="#1d4ed8"/>}
              </div>
            </div>
            <div className="card">
              <div className="card-header"><div className="card-title">👁️ Aperçu en temps réel</div></div>
              <div style={{padding:'4px',background:'#f8fafc',borderRadius:'0 0 12px 12px',overflow:'hidden'}}>
                <div style={{transform:'scale(0.48)',transformOrigin:'top left',width:'208%',height:'240px',overflow:'hidden',pointerEvents:'none'}}>
                  {renderSchema()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step===3 && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">🔩 Accessoires & Équipements</div>
            <span style={{background:'#f3e8ff',color:'#6b21a8',padding:'3px 10px',borderRadius:'20px',fontSize:'0.72rem',fontWeight:700}}>
              {Object.values(acc).filter(Boolean).length} sélectionnés
            </span>
          </div>
          <div className="card-body" style={{display:'flex',flexDirection:'column',gap:'16px'}}>
            {accDefs.map(g=>{
              const items=g.items.filter(i=>i.t.includes(type));
              if(!items.length) return null;
              return (
                <div key={g.label}>
                  <div style={{fontWeight:700,fontSize:'0.8rem',color:g.color,marginBottom:'8px',display:'flex',alignItems:'center',gap:'6px'}}>
                    <span style={{width:'7px',height:'7px',borderRadius:'50%',background:g.color,display:'inline-block'}}></span>{g.label}
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'7px'}}>
                    {items.map(item=>(
                      <div key={item.k} onClick={()=>tog(item.k)}
                        style={{display:'flex',alignItems:'center',gap:'9px',padding:'9px 12px',border:`1.5px solid ${acc[item.k]?g.color:'#e2e8f0'}`,borderRadius:'7px',cursor:'pointer',background:acc[item.k]?g.color+'10':'white',transition:'all 0.15s'}}>
                        <div style={{width:'17px',height:'17px',borderRadius:'3px',border:`2px solid ${acc[item.k]?g.color:'#cbd5e1'}`,background:acc[item.k]?g.color:'white',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                          {acc[item.k]&&<span style={{color:'white',fontSize:'10px',fontWeight:700}}>✓</span>}
                        </div>
                        <span style={{fontSize:'0.8rem',fontWeight:500,color:acc[item.k]?'#1e293b':'#64748b'}}>{item.l}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            <div style={{display:'flex',gap:'10px',marginTop:'6px'}}>
              <button onClick={()=>setStep(2)} style={{flex:1,padding:'11px',border:'1.5px solid #e2e8f0',borderRadius:'9px',cursor:'pointer',fontWeight:600,background:'white'}}>← Retour</button>
              <button onClick={()=>{setReady(true);setStep(4);}} style={{flex:3,background:'linear-gradient(135deg,#6366f1,#4338ca)',color:'white',padding:'11px',borderRadius:'9px',border:'none',cursor:'pointer',fontWeight:700,fontSize:'0.95rem'}}>
                ⚡ Générer le Schéma Expert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4 */}
      {step===4 && ready && (
        <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
          <div style={{display:'flex',gap:'10px',flexWrap:'wrap',alignItems:'center'}}>
            <button onClick={()=>setStep(2)} style={{padding:'8px 14px',border:'1.5px solid #e2e8f0',borderRadius:'7px',cursor:'pointer',fontWeight:600,background:'white',fontSize:'0.82rem'}}>← Données</button>
            <button onClick={()=>setStep(3)} style={{padding:'8px 14px',border:'1.5px solid #a5b4fc',borderRadius:'7px',cursor:'pointer',fontWeight:600,background:'#f5f3ff',color:'#4338ca',fontSize:'0.82rem'}}>🔩 Accessoires</button>
            <button onClick={handlePrint} style={{padding:'8px 20px',background:'linear-gradient(135deg,#ef4444,#dc2626)',color:'white',border:'none',borderRadius:'7px',cursor:'pointer',fontWeight:700,fontSize:'0.88rem',boxShadow:'0 4px 12px rgba(239,68,68,0.3)'}}>
              🖨️ Imprimer / Exporter PDF
            </button>
            <div style={{marginLeft:'auto',background:'#f0fdf4',border:'1px solid #86efac',borderRadius:'8px',padding:'6px 14px',fontSize:'0.78rem',fontWeight:700,color:'#15803d'}}>
              HMT = {calc.HMT} m | Pa = {calc.Pa} kW
            </div>
          </div>
          <div style={{background:'white',border:'1px solid #e2e8f0',borderRadius:'12px',overflow:'hidden',boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}>
            {renderSchema()}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'10px'}}>
            {accDefs.map(g=>{
              const sel=g.items.filter(i=>i.t.includes(type)&&acc[i.k]);
              if(!sel.length) return null;
              return (
                <div key={g.label} style={{background:'white',border:`1px solid ${g.color}25`,borderRadius:'8px',padding:'12px',borderLeft:`3px solid ${g.color}`}}>
                  <div style={{fontWeight:700,fontSize:'0.72rem',color:g.color,marginBottom:'6px',textTransform:'uppercase'}}>{g.label}</div>
                  {sel.map(i=><div key={i.k} style={{fontSize:'0.75rem',color:'#475569',marginBottom:'2px'}}>✓ {i.l}</div>)}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// OUTIL 1 : COUP DE BÉLIER (Water Hammer)
// ============================================================
const WaterHammerCalculator = () => {
  const [data, setData] = useState({
    flow_rate: 50,
    pipe_diameter: 100,
    pipe_length: 500,
    pipe_material: 'steel',
    fluid: 'water',
    valve_closure_time: 2,
    wave_speed: null,
  });
  const [result, setResult] = useState(null);

  const materials = {
    steel: { E: 210e9, name: 'Acier' },
    pvc: { E: 3e9, name: 'PVC' },
    pehd: { E: 0.8e9, name: 'PEHD' },
    cast_iron: { E: 100e9, name: 'Fonte' },
    concrete: { E: 30e9, name: 'Béton' },
  };

  const set = (k, v) => setData(p => ({ ...p, [k]: v }));

  const calculate = () => {
    const Q = data.flow_rate / 3600;
    const D = data.pipe_diameter / 1000;
    const L = data.pipe_length;
    const Tc = data.valve_closure_time;
    const A = Math.PI * (D / 2) ** 2;
    const V = Q / A;
    const rho = 1000;
    const K = 2.1e9; // bulk modulus water
    const E = materials[data.pipe_material]?.E || 210e9;
    const e = D * 0.01; // wall thickness ~1% of D
    const a = Math.sqrt(K / rho / (1 + (K * D) / (E * e)));
    const Tr = 2 * L / a; // period
    const dP_joukowsky = rho * a * V;
    const dP_actual = Tc < Tr ? dP_joukowsky : dP_joukowsky * (Tr / Tc);
    const dP_bar = dP_actual / 1e5;
    setResult({
      velocity: V,
      wave_speed: a,
      period: Tr,
      dP_joukowsky: dP_joukowsky / 1e5,
      dP_actual: dP_bar,
      critical: Tc < Tr,
      safe: dP_bar < 10,
    });
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #1e4d8c)', borderRadius: '16px', padding: '28px', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-10px', top: '-10px', fontSize: '120px', opacity: 0.06 }}>🌊</div>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', color: '#7dd3fc', textTransform: 'uppercase', marginBottom: '8px' }}>Analyse Transitoire</div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.02em' }}>Coup de Bélier</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>Calcul de la surpression transitoire par fermeture de vanne (méthode Joukowsky)</p>
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
          {['✅ Formule Joukowsky', '✅ Celerité célérité onde', '✅ Fermeture rapide/lente'].map(s => (
            <span key={s} style={{ fontSize: '0.72rem', color: '#bae6fd', fontWeight: 600 }}>{s}</span>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Inputs */}
        <div className="card">
          <div className="card-header"><div className="card-title">⚙️ Paramètres</div></div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { label: 'Débit (m³/h)', key: 'flow_rate', step: 1 },
              { label: 'Diamètre DN (mm)', key: 'pipe_diameter', step: 10 },
              { label: 'Longueur conduite (m)', key: 'pipe_length', step: 10 },
              { label: 'Temps fermeture vanne (s)', key: 'valve_closure_time', step: 0.5 },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '5px' }}>{f.label}</label>
                <input type="number" value={data[f.key]} step={f.step}
                  onChange={e => set(f.key, parseFloat(e.target.value))}
                  style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--slate-200)', borderRadius: '6px', fontSize: '0.875rem' }} />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '5px' }}>Matériau conduite</label>
              <select value={data.pipe_material} onChange={e => set('pipe_material', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--slate-200)', borderRadius: '6px', fontSize: '0.875rem' }}>
                {Object.entries(materials).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
              </select>
            </div>
            <button onClick={calculate}
              style={{ background: 'linear-gradient(135deg, #1e4d8c, #1e3a5f)', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem', marginTop: '8px' }}>
              🌊 Calculer le coup de bélier
            </button>
          </div>
        </div>

        {/* Schéma */}
        <div className="card">
          <div className="card-header"><div className="card-title">📐 Schéma hydraulique</div></div>
          <div className="card-body">
            <svg viewBox="0 0 400 220" style={{ width: '100%', height: 'auto' }}>
              {/* Background */}
              <rect width="400" height="220" fill="#f8fafc" rx="8"/>
              {/* Reservoir */}
              <rect x="20" y="60" width="60" height="100" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" rx="4"/>
              <text x="50" y="50" textAnchor="middle" fontSize="11" fontWeight="600" fill="#1e40af">Réservoir</text>
              <line x1="20" y1="100" x2="80" y2="100" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4"/>
              <text x="50" y="96" textAnchor="middle" fontSize="9" fill="#3b82f6">H₀</text>
              {/* Pipe */}
              <rect x="80" y="105" width="230" height="20" fill="#bfdbfe" stroke="#2563eb" strokeWidth="2"/>
              <text x="195" y="97" textAnchor="middle" fontSize="11" fontWeight="600" fill="#1e40af">Conduite L, DN, matériau</text>
              {/* Flow arrow */}
              <line x1="130" y1="115" x2="220" y2="115" stroke="#2563eb" strokeWidth="1.5" markerEnd="url(#arrow2)"/>
              <defs>
                <marker id="arrow2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="#2563eb"/>
                </marker>
                <marker id="arrowRed" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="#ef4444"/>
                </marker>
              </defs>
              <text x="175" y="130" textAnchor="middle" fontSize="9" fill="#2563eb">V → Q</text>
              {/* Valve */}
              <rect x="310" y="98" width="30" height="34" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" rx="4"/>
              <line x1="325" y1="98" x2="325" y2="132" stroke="#f59e0b" strokeWidth="2"/>
              <line x1="310" y1="115" x2="340" y2="115" stroke="#f59e0b" strokeWidth="2"/>
              <text x="325" y="145" textAnchor="middle" fontSize="10" fontWeight="600" fill="#d97706">Vanne</text>
              <text x="325" y="158" textAnchor="middle" fontSize="9" fill="#d97706">Tc = {data.valve_closure_time}s</text>
              {/* Pressure wave */}
              <path d="M 310 80 Q 270 60 230 80 Q 190 100 150 80" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,3"/>
              <text x="230" y="68" textAnchor="middle" fontSize="10" fontWeight="600" fill="#ef4444">Onde de pression ΔP</text>
              <line x1="230" y1="72" x2="200" y2="80" stroke="#ef4444" strokeWidth="1" markerEnd="url(#arrowRed)"/>
              {/* Formula */}
              <rect x="60" y="175" width="280" height="32" fill="#fef2f2" rx="6" stroke="#fca5a5"/>
              <text x="200" y="188" textAnchor="middle" fontSize="10" fontWeight="600" fill="#dc2626">ΔP = ρ · a · V</text>
              <text x="200" y="200" textAnchor="middle" fontSize="9" fill="#ef4444">a = célérité onde (m/s) | V = vitesse écoulement</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="card fade-in">
          <div className="card-header">
            <div className="card-title">📊 Résultats</div>
            <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700,
              background: result.safe ? '#dcfce7' : '#fee2e2', color: result.safe ? '#166534' : '#991b1b' }}>
              {result.safe ? '✅ PRESSION ACCEPTABLE' : '⚠️ SURPRESSION CRITIQUE'}
            </span>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '20px' }}>
              {[
                { label: 'Vitesse écoulement', value: result.velocity.toFixed(2), unit: 'm/s', ok: result.velocity < 2 },
                { label: 'Célérité onde', value: result.wave_speed.toFixed(0), unit: 'm/s', ok: true },
                { label: 'Période critique', value: result.period.toFixed(2), unit: 's', ok: true },
                { label: 'ΔP Joukowsky', value: result.dP_joukowsky.toFixed(2), unit: 'bar', ok: result.dP_joukowsky < 10 },
                { label: 'ΔP réelle', value: result.dP_actual.toFixed(2), unit: 'bar', ok: result.safe },
                { label: 'Fermeture', value: result.critical ? 'RAPIDE' : 'LENTE', unit: '', ok: !result.critical },
              ].map((r, i) => (
                <div key={i} style={{ background: r.ok ? '#f0fdf4' : '#fef2f2', border: `1.5px solid ${r.ok ? '#86efac' : '#fca5a5'}`, borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: r.ok ? '#16a34a' : '#dc2626', fontFamily: 'monospace' }}>{r.value}</div>
                  <div style={{ fontSize: '0.72rem', color: r.ok ? '#15803d' : '#b91c1c', fontWeight: 600 }}>{r.unit}</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>{r.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: result.critical ? '#fef2f2' : '#f0fdf4', border: `1px solid ${result.critical ? '#fca5a5' : '#86efac'}`, borderRadius: '10px', padding: '16px' }}>
              <div style={{ fontWeight: 700, marginBottom: '8px', color: result.critical ? '#dc2626' : '#16a34a' }}>
                {result.critical ? '⚠️ Fermeture rapide (Tc < Tr = ' + result.period.toFixed(1) + 's)' : '✅ Fermeture lente (Tc > Tr = ' + result.period.toFixed(1) + 's)'}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                {result.critical
                  ? `La fermeture est rapide → surpression maximale de ${result.dP_actual.toFixed(1)} bar. Recommandation : augmenter Tc > ${result.period.toFixed(1)}s, ou installer un anti-bélier.`
                  : `La fermeture est lente → surpression réduite de ${result.dP_actual.toFixed(1)} bar. Le système est dans des conditions acceptables.`}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// OUTIL 2 : SÉLECTION DE POMPE
// ============================================================
const PumpSelector = () => {
  const [data, setData] = useState({ Q: 30, H: 20, fluid: 'water', temp: 20, installation: 'surface' });
  const [result, setResult] = useState(null);
  const set = (k, v) => setData(p => ({ ...p, [k]: v }));

  const pumpDatabase = [
    { brand: 'Grundfos', model: 'CM5-4', Qn: 5, Hn: 40, eta: 62, Pn: 0.75, type: 'Centrifuge multicellulaire', app: 'Distribution eau, irrigation' },
    { brand: 'Grundfos', model: 'NB 32-125', Qn: 15, Hn: 22, eta: 68, Pn: 1.5, type: 'Centrifuge normalisée', app: 'Industrie, bâtiment' },
    { brand: 'Grundfos', model: 'NB 50-160', Qn: 30, Hn: 32, eta: 72, Pn: 5.5, type: 'Centrifuge normalisée', app: 'Industrie, HVAC' },
    { brand: 'Grundfos', model: 'SP 17-6', Qn: 17, Hn: 60, eta: 65, Pn: 4, type: 'Submersible forage', app: 'Forage, puits' },
    { brand: 'KSB', model: 'Etanorm 32-125', Qn: 12, Hn: 20, eta: 65, Pn: 1.1, type: 'Centrifuge normalisée', app: 'Eau propre, industrie' },
    { brand: 'KSB', model: 'Etanorm 50-160', Qn: 28, Hn: 28, eta: 71, Pn: 4, type: 'Centrifuge normalisée', app: 'Industrie, bâtiment' },
    { brand: 'KSB', model: 'Mega 50-160', Qn: 35, Hn: 35, eta: 74, Pn: 7.5, type: 'Centrifuge haute perf.', app: 'Industrie, HVAC' },
    { brand: 'Wilo', model: 'IL 50/145-4', Qn: 25, Hn: 20, eta: 69, Pn: 4, type: 'Inline centrifuge', app: 'Chauffage, climatisation' },
    { brand: 'Wilo', model: 'MVI 806', Qn: 8, Hn: 55, eta: 63, Pn: 2.2, type: 'Multicellulaire verticale', app: 'Surpression, distribution' },
    { brand: 'Lowara', model: 'e-SV 4', Qn: 4, Hn: 80, eta: 60, Pn: 1.5, type: 'Multicellulaire verticale', app: 'Surpression, irrigation' },
    { brand: 'Ebara', model: '3LM 50-125', Qn: 22, Hn: 16, eta: 67, Pn: 2.2, type: 'Centrifuge normalisée', app: 'Agriculture, industrie' },
    { brand: 'Ebara', model: 'BM3 65-200', Qn: 50, Hn: 30, eta: 73, Pn: 11, type: 'Centrifuge normalisée', app: 'Industrie, municipal' },
  ];

  const findPumps = () => {
    const Q = data.Q;
    const H = data.H;
    const tolerance = 0.4;
    const scored = pumpDatabase.map(p => {
      const qMatch = Math.abs(p.Qn - Q) / Q;
      const hMatch = Math.abs(p.Hn - H) / H;
      const score = 100 - (qMatch + hMatch) * 50;
      return { ...p, score: Math.max(0, score), qMatch, hMatch };
    }).filter(p => p.qMatch < tolerance && p.hMatch < tolerance)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const rho = 1000, g = 9.81;
    const Ph = (rho * g * Q / 3600 * H) / 1000;
    setResult({ pumps: scored, Ph });
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ background: 'linear-gradient(135deg, #134e4a, #0f766e)', borderRadius: '16px', padding: '28px', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-10px', top: '-10px', fontSize: '120px', opacity: 0.06 }}>⚙️</div>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', color: '#5eead4', textTransform: 'uppercase', marginBottom: '8px' }}>Aide à la décision</div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.02em' }}>Sélection de Pompe</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>Trouvez les pompes adaptées à votre point de fonctionnement</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '20px' }}>
        <div className="card">
          <div className="card-header"><div className="card-title">🎯 Point de fonctionnement</div></div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { label: 'Débit requis Q (m³/h)', key: 'Q' },
              { label: 'HMT requise H (m)', key: 'H' },
              { label: 'Température (°C)', key: 'temp' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '5px' }}>{f.label}</label>
                <input type="number" value={data[f.key]} onChange={e => set(f.key, parseFloat(e.target.value))}
                  style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--slate-200)', borderRadius: '6px', fontSize: '0.875rem' }} />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '5px' }}>Installation</label>
              <select value={data.installation} onChange={e => set('installation', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--slate-200)', borderRadius: '6px', fontSize: '0.875rem' }}>
                <option value="surface">Surface (horizontal / vertical)</option>
                <option value="submersible">Submersible / Forage</option>
                <option value="inline">En ligne (inline)</option>
              </select>
            </div>
            <button onClick={findPumps}
              style={{ background: 'linear-gradient(135deg, #0f766e, #134e4a)', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem' }}>
              🔍 Rechercher des pompes
            </button>
          </div>
        </div>

        {result ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', padding: '14px 18px', display: 'flex', gap: '24px', alignItems: 'center' }}>
              <div><span style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 600 }}>Puissance hydraulique requise</span><br/>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#15803d' }}>{result.Ph.toFixed(2)} kW</span></div>
              <div style={{ fontSize: '0.82rem', color: '#16a34a' }}>Point Q={data.Q} m³/h | H={data.H} m</div>
            </div>
            {result.pumps.length === 0 ? (
              <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--slate-500)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔍</div>
                Aucune pompe trouvée pour ce point. Élargissez les critères.
              </div>
            ) : result.pumps.map((p, i) => (
              <div key={i} className="card" style={{ border: i === 0 ? '2px solid #14b8a6' : '1px solid var(--slate-200)' }}>
                <div className="card-body" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      {i === 0 && <span style={{ background: '#ccfbf1', color: '#0f766e', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', marginBottom: '6px', display: 'inline-block' }}>⭐ MEILLEURE CORRESPONDANCE</span>}
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--navy-900)' }}>{p.brand} — {p.model}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--slate-600)', marginTop: '2px' }}>{p.type}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f766e' }}>{p.score.toFixed(0)}%</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>Adéquation</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                    {[
                      { l: 'Débit nominal', v: `${p.Qn} m³/h` },
                      { l: 'HMT nominale', v: `${p.Hn} m` },
                      { l: 'Rendement', v: `${p.eta}%` },
                      { l: 'Puissance moteur', v: `${p.Pn} kW` },
                    ].map((s, j) => (
                      <div key={j} style={{ background: 'var(--slate-50)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--navy-900)' }}>{s.v}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--slate-500)', marginTop: '2px' }}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--slate-500)' }}>📌 {p.app}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', color: 'var(--slate-400)', padding: '60px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>⚙️</div>
              <div style={{ fontWeight: 600 }}>Entrez votre point de fonctionnement</div>
              <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>Les pompes correspondantes s'afficheront ici</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// OUTIL 3 : CALCUL PUISSANCE MOTEUR & CÂBLAGE
// ============================================================
const MotorCableCalculator = () => {
  const [data, setData] = useState({ Ph: 5, eta_pump: 75, eta_motor: 92, voltage: 400, pf: 0.85, cable_length: 50, cable_material: 'copper', delta_U_max: 3 });
  const [result, setResult] = useState(null);
  const set = (k, v) => setData(p => ({ ...p, [k]: v }));

  const cableSections = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120];
  const rho = { copper: 0.0172e-6, aluminum: 0.028e-6 };

  const calculate = () => {
    const Pa = (data.Ph / (data.eta_pump / 100)) / (data.eta_motor / 100);
    const I = (Pa * 1000) / (Math.sqrt(3) * data.voltage * data.pf);
    const dU_target = data.voltage * data.delta_U_max / 100;
    const rho_m = rho[data.cable_material];
    // S = rho * sqrt(3) * I * L / dU
    const S_min = (rho_m * Math.sqrt(3) * I * data.cable_length) / dU_target * 1e6;
    const S_chosen = cableSections.find(s => s >= S_min) || cableSections[cableSections.length - 1];
    const dU_actual = (rho_m * Math.sqrt(3) * I * data.cable_length) / (S_chosen / 1e6) / data.voltage * 100;
    setResult({ Pa, I, S_min, S_chosen, dU_actual });
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ background: 'linear-gradient(135deg, #431407, #7c2d12)', borderRadius: '16px', padding: '28px', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-10px', top: '-10px', fontSize: '120px', opacity: 0.06 }}>⚡</div>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', color: '#fdba74', textTransform: 'uppercase', marginBottom: '8px' }}>Électrotechnique</div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.02em' }}>Puissance Moteur & Câblage</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>Dimensionnement électrique complet : puissance absorbée, intensité, section de câble</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="card">
          <div className="card-header"><div className="card-title">⚙️ Paramètres</div></div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { label: 'Puissance hydraulique Ph (kW)', key: 'Ph' },
              { label: 'Rendement pompe ηp (%)', key: 'eta_pump' },
              { label: 'Rendement moteur ηm (%)', key: 'eta_motor' },
              { label: 'Tension réseau (V)', key: 'voltage' },
              { label: 'Facteur de puissance cos φ', key: 'pf' },
              { label: 'Longueur câble (m)', key: 'cable_length' },
              { label: 'Chute tension max (%)', key: 'delta_U_max' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '4px' }}>{f.label}</label>
                <input type="number" value={data[f.key]} step="0.1" onChange={e => set(f.key, parseFloat(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', border: '1.5px solid var(--slate-200)', borderRadius: '6px', fontSize: '0.875rem' }}/>
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '4px' }}>Matériau câble</label>
              <select value={data.cable_material} onChange={e => set('cable_material', e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1.5px solid var(--slate-200)', borderRadius: '6px', fontSize: '0.875rem' }}>
                <option value="copper">Cuivre</option>
                <option value="aluminum">Aluminium</option>
              </select>
            </div>
            <button onClick={calculate}
              style={{ background: 'linear-gradient(135deg, #7c2d12, #431407)', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem' }}>
              ⚡ Calculer le câblage
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Schema */}
          <div className="card">
            <div className="card-header"><div className="card-title">📐 Schéma électrique simplifié</div></div>
            <div className="card-body">
              <svg viewBox="0 0 360 180" style={{ width: '100%' }}>
                <rect width="360" height="180" fill="#fafafa" rx="8"/>
                {/* Réseau */}
                <rect x="10" y="60" width="50" height="60" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" rx="4"/>
                <text x="35" y="87" textAnchor="middle" fontSize="9" fill="#1e40af" fontWeight="600">Réseau</text>
                <text x="35" y="100" textAnchor="middle" fontSize="9" fill="#1e40af">{data.voltage}V</text>
                <text x="35" y="112" textAnchor="middle" fontSize="9" fill="#1e40af">3~</text>
                {/* Cable */}
                <line x1="60" y1="90" x2="140" y2="90" stroke="#f97316" strokeWidth="4"/>
                <line x1="60" y1="96" x2="140" y2="96" stroke="#f97316" strokeWidth="4"/>
                <line x1="60" y1="84" x2="140" y2="84" stroke="#f97316" strokeWidth="4"/>
                <text x="100" y="76" textAnchor="middle" fontSize="9" fill="#ea580c" fontWeight="600">Câble {data.cable_length}m</text>
                {/* Disjoncteur */}
                <rect x="140" y="70" width="28" height="40" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" rx="3"/>
                <line x1="154" y1="78" x2="154" y2="102" stroke="#f59e0b" strokeWidth="2"/>
                <text x="154" y="125" textAnchor="middle" fontSize="9" fill="#d97706" fontWeight="600">Disj.</text>
                {/* Motor */}
                <circle cx="250" cy="90" r="35" fill="#dcfce7" stroke="#16a34a" strokeWidth="2"/>
                <text x="250" y="86" textAnchor="middle" fontSize="12" fontWeight="800" fill="#15803d">M</text>
                <text x="250" y="100" textAnchor="middle" fontSize="9" fill="#16a34a">3~</text>
                <line x1="168" y1="90" x2="215" y2="90" stroke="#f97316" strokeWidth="3"/>
                {/* Pump */}
                <circle cx="320" cy="90" r="25" fill="#dbeafe" stroke="#2563eb" strokeWidth="2"/>
                <text x="320" y="94" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1e40af">P</text>
                <line x1="285" y1="90" x2="295" y2="90" stroke="#94a3b8" strokeWidth="2"/>
                {/* Labels */}
                <text x="250" y="150" textAnchor="middle" fontSize="9" fill="#15803d">Moteur η={data.eta_motor}%</text>
                <text x="320" y="150" textAnchor="middle" fontSize="9" fill="#1e40af">Pompe η={data.eta_pump}%</text>
              </svg>
            </div>
          </div>

          {/* Results */}
          {result && (
            <div className="card fade-in">
              <div className="card-header"><div className="card-title">📊 Résultats électriques</div></div>
              <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { l: 'Puissance absorbée', v: result.Pa.toFixed(2), u: 'kW' },
                  { l: 'Intensité nominale', v: result.I.toFixed(1), u: 'A' },
                  { l: 'Section min calculée', v: result.S_min.toFixed(1), u: 'mm²' },
                  { l: 'Section normalisée', v: result.S_chosen, u: 'mm²', highlight: true },
                  { l: 'Chute de tension', v: result.dU_actual.toFixed(2), u: '%', ok: result.dU_actual <= data.delta_U_max },
                ].map((r, i) => (
                  <div key={i} style={{ background: r.highlight ? '#f0fdf4' : r.ok === false ? '#fef2f2' : 'var(--slate-50)', border: `1.5px solid ${r.highlight ? '#86efac' : r.ok === false ? '#fca5a5' : 'var(--slate-200)'}`, borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.2rem', color: r.highlight ? '#16a34a' : r.ok === false ? '#dc2626' : 'var(--navy-900)' }}>{r.v} <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{r.u}</span></div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)', marginTop: '2px' }}>{r.l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// DASHBOARD HOME (amélioré)
// ============================================================
const DashboardHome = ({ onNavigate }) => {
  const modules = [
    { id: 'npshd', icon: '🔷', title: 'Calcul NPSHd', desc: 'Net Positive Suction Head — prévention cavitation', cls: 'npshd', color: '#3b82f6' },
    { id: 'hmt', icon: '🔶', title: 'Calcul HMT', desc: 'Hauteur Manométrique Totale et pertes de charge', cls: 'hmt', color: '#10b981' },
    { id: 'performance', icon: '📊', title: 'Performance', desc: 'Courbes de performance et point optimal', cls: 'perf', color: '#f59e0b' },
    { id: 'pump_selector', icon: '⚙️', title: 'Sélection Pompe', desc: 'Choisir la pompe adaptée à votre besoin', cls: 'chemical', color: '#14b8a6' },
    { id: 'water_hammer', icon: '🌊', title: 'Coup de Bélier', desc: 'Analyse transitoire — surpressions Joukowsky', cls: 'audit', color: '#6366f1' },
    { id: 'motor_cable', icon: '⚡', title: 'Moteur & Câblage', desc: 'Puissance absorbée et section de câble', cls: 'expert', color: '#f97316' },
    { id: 'formulas', icon: '📚', title: 'Base de Formules', desc: 'Bibliothèque des formules hydrauliques', cls: 'formulas', color: '#8b5cf6' },
    { id: 'chemical_compatibility', icon: '🧪', title: 'Compatibilité Chimique', desc: 'Compatibilité fluides / matériaux', cls: 'chemical', color: '#0891b2' },
    { id: 'audit', icon: '🔧', title: 'Audit ISO 50001', desc: 'Audit hydraulique & énergétique complet', cls: 'audit', color: '#6366f1' },
    { id: 'expert', icon: '🎯', title: 'Expert Pro', desc: 'Analyse experte avec rapport PDF', cls: 'expert', color: '#ec4899' },
    { id: 'solar', icon: '☀️', title: 'Expert Solaire', desc: 'Dimensionnement pompage photovoltaïque', cls: 'solar', color: '#f97316' },
  ];

  return (
    <div className="dashboard-home fade-in">
      <div className="dashboard-hero">
        <div className="dashboard-hero-title">Bienvenue sur <span>ECO-PUMP AFRIK</span></div>
        <p className="dashboard-hero-desc">La plateforme de référence pour le calcul hydraulique professionnel. Dimensionnez, auditez et optimisez vos installations de pompage.</p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-lg" onClick={() => onNavigate('npshd')}>🚀 Commencer un calcul</button>
          <button onClick={() => onNavigate('expert')} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '13px 28px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}>🎯 Mode Expert</button>
        </div>
      </div>

      <div className="dashboard-stats">
        {[
          { icon: '🔧', label: 'Modules disponibles', value: '11', color: '#3b82f6', bg: '#dbeafe' },
          { icon: '📐', label: 'Formules hydrauliques', value: '60+', color: '#10b981', bg: '#d1fae5' },
          { icon: '🧪', label: 'Fluides référencés', value: '15+', color: '#f59e0b', bg: '#fef3c7' },
          { icon: '⚙️', label: 'Pompes en base', value: '12+', color: '#8b5cf6', bg: '#ede9fe' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg }}><span style={{ fontSize: '18px' }}>{s.icon}</span></div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '4px' }}>Tous les modules</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--slate-600)' }}>Cliquez sur un module pour commencer</p>
      </div>
      <div className="module-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {modules.map(m => (
          <div key={m.id} className={`module-card ${m.cls}`} onClick={() => onNavigate(m.id)} style={{ borderTop: `3px solid ${m.color}` }}>
            <span className="module-icon">{m.icon}</span>
            <div className="module-title">{m.title}</div>
            <div className="module-desc">{m.desc}</div>
            <div className="module-arrow" style={{ background: m.color + '18', color: m.color }}>→</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '20px 24px', border: '1px solid var(--slate-200)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginTop: '8px' }}>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {['✅ ISO 50001', '✅ IEC 60034', '✅ ASHRAE', '✅ Joukowsky', '✅ Darcy-Weisbach'].map(s => (
            <span key={s} style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-600)' }}>{s}</span>
          ))}
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)', fontFamily: 'monospace' }}>v4.0 PRO</span>
      </div>
    </div>
  );
};

// APP PRINCIPAL
// ============================================================
function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [fluids, setFluids] = useState([]);
  const [pipeMaterials, setPipeMaterials] = useState([]);
  const [fittings, setFittings] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [fluidsRes, materialsRes, fittingsRes, historyRes] = await Promise.all([
        axios.get(`${API}/fluids`),
        axios.get(`${API}/pipe-materials`),
        axios.get(`${API}/fittings`),
        axios.get(`${API}/history`)
      ]);
      setFluids(fluidsRes.data.fluids);
      setPipeMaterials(materialsRes.data.materials);
      setFittings(fittingsRes.data.fittings);
      setHistory(historyRes.data);
    } catch (error) { console.error('Erreur chargement données:', error); }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home': return <DashboardHome onNavigate={setActiveTab} />;
      case 'npshd': return <NPSHdCalculator fluids={fluids} pipeMaterials={pipeMaterials} fittings={fittings} />;
      case 'hmt': return <HMTCalculator fluids={fluids} pipeMaterials={pipeMaterials} fittings={fittings} />;
      case 'performance': return <PerformanceAnalysis fluids={fluids} pipeMaterials={pipeMaterials} />;
      case 'drawing': return <DrawingTool />;
      case 'pump_selector': return <PumpSelector />;
      case 'water_hammer': return <WaterHammerCalculator />;
      case 'motor_cable': return <MotorCableCalculator />;
      case 'formulas': return <FormulaDatabase />;
      case 'chemical_compatibility': return <ChemicalCompatibility />;
      case 'audit': return <AuditSystem />;
      case 'expert': return <ExpertCalculator fluids={fluids} pipeMaterials={pipeMaterials} fittings={fittings} />;
      case 'solar': return <SolarExpertSystem />;
      case 'history': return (
        <div className="card fade-in">
          <div className="card-header"><div className="card-title">📋 Historique des Calculs</div></div>
          <div className="card-body">
            {history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--slate-500)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📭</div>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>Aucun calcul sauvegardé</div>
                <div style={{ fontSize: '0.82rem' }}>Vos calculs apparaîtront ici.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {history.map((item) => (
                  <div key={item.id} style={{ border: '1px solid var(--slate-200)', borderRadius: '10px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--navy-900)', marginBottom: '3px' }}>{item.project_name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>{new Date(item.timestamp).toLocaleString('fr-FR')}</div>
                    </div>
                    <span style={{ background: '#ccfbf1', color: '#0f766e', padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700 }}>Sauvegardé</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
      default: return null;
    }
  };

  const navItems = [
    { id: 'home', icon: '🏠', label: 'Accueil' },
    { id: 'npshd', icon: '🔷', label: 'NPSHd' },
    { id: 'hmt', icon: '🔶', label: 'HMT' },
    { id: 'performance', icon: '📊', label: 'Performance' },
    { id: 'drawing', icon: '📐', label: 'Dessin' },
    { id: 'pump_selector', icon: '⚙️', label: 'Sélection' },
    { id: 'water_hammer', icon: '🌊', label: 'Bélier' },
    { id: 'motor_cable', icon: '⚡', label: 'Moteur' },
    { id: 'formulas', icon: '📚', label: 'Formules' },
    { id: 'chemical_compatibility', icon: '🧪', label: 'Chimie' },
    { id: 'audit', icon: '🔧', label: 'Audit' },
    { id: 'expert', icon: '🎯', label: 'Expert' },
    { id: 'solar', icon: '☀️', label: 'Solaire' },
    { id: 'history', icon: '📋', label: 'Historique' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--slate-100)' }}>
      <header className="app-header no-print">
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0 10px' }}>
            <div className="header-brand" onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>
              <div className="header-logo">💧</div>
              <div>
                <div className="header-title">ECO-PUMP AFRIK</div>
                <div className="header-subtitle">Calculateur Hydraulique Professionnel</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="header-badge"><div className="header-badge-dot"></div><span className="header-badge-text">ACTIF</span></div>
              <span className="header-version">v4.0 PRO</span>
            </div>
          </div>
          <nav className="app-nav">
            {navItems.map(item => (
              <button key={item.id} className={`nav-btn ${activeTab === item.id ? 'active' : ''}`} onClick={() => setActiveTab(item.id)}>
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main className="app-main">{renderTabContent()}</main>
    </div>
  );
}

export default App;
