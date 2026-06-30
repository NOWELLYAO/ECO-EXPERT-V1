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
                      type="text" inputMode="decimal"
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
                      type="text" inputMode="decimal"
                      value={hydraulicAuditData.current_flow_rate}
                      onChange={(e) => setHydraulicAuditData(prev => ({...prev, current_flow_rate: e.target.value}))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: 45"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">HMT actuelle (m)</label>
                    <input
                      type="text" inputMode="decimal"
                      value={hydraulicAuditData.current_head}
                      onChange={(e) => setHydraulicAuditData(prev => ({...prev, current_head: e.target.value}))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: 32"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rendement estimé (%)</label>
                    <input
                      type="text" inputMode="decimal"
                      value={hydraulicAuditData.current_efficiency}
                      onChange={(e) => setHydraulicAuditData(prev => ({...prev, current_efficiency: e.target.value}))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: 75"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heures/jour</label>
                    <input
                      type="text" inputMode="decimal"
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
                      type="text" inputMode="decimal"
                      value={energyAuditData.electricity_tariff}
                      onChange={(e) => setEnergyAuditData(prev => ({...prev, electricity_tariff: e.target.value}))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      placeholder="96"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heures pleines (FCFA/kWh)</label>
                    <input
                      type="text" inputMode="decimal"
                      value={energyAuditData.peak_hours_tariff}
                      onChange={(e) => setEnergyAuditData(prev => ({...prev, peak_hours_tariff: e.target.value}))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      placeholder="150"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heures creuses (FCFA/kWh)</label>
                    <input
                      type="text" inputMode="decimal"
                      value={energyAuditData.off_peak_tariff}
                      onChange={(e) => setEnergyAuditData(prev => ({...prev, off_peak_tariff: e.target.value}))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      placeholder="75"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prime puissance (FCFA/kW/mois)</label>
                    <input
                      type="text" inputMode="decimal"
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
                      type="text" inputMode="decimal"
                      value={energyAuditData.power_consumption_measured}
                      onChange={(e) => setEnergyAuditData(prev => ({...prev, power_consumption_measured: e.target.value}))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                      placeholder="Ex: 8.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Facteur de puissance</label>
                    <input
                      type="text" inputMode="decimal"
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
                      type="text" inputMode="decimal"
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
                onFocus={e=>e.target.select()}
                onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
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
                type="text" inputMode="decimal"
                value={solarData.autonomy_days}
                onChange={(e) => handleInputChange('autonomy_days', parseInt(e.target.value))}
                onFocus={e=>e.target.select()}
                onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                min="1" max="7"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Budget maximum (€)</label>
              <input
                type="text" inputMode="decimal"
                value={solarData.max_budget || ''}
                onChange={(e) => handleInputChange('max_budget', e.target.value ? parseFloat(e.target.value) : null)}
                onFocus={e=>e.target.select()}
                onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
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
                  type="text" inputMode="decimal"
                  step="0.1"
                  value={solarData.daily_water_need}
                  onChange={(e) => handleInputChange('daily_water_need', parseFloat(e.target.value))}
                  onFocus={e=>e.target.select()}
                  onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                  className="w-full p-3 border-2 border-cyan-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 text-lg font-semibold"
                />
                <p className="text-xs text-cyan-600 mt-1">Volume d'eau nécessaire par jour</p>
              </div>

              <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                <label className="block text-sm font-medium text-blue-700 mb-2">Heures fonctionnement/jour</label>
                <input
                  type="text" inputMode="decimal"
                  step="0.5"
                  min="1"
                  max="12"
                  value={solarData.operating_hours}
                  onChange={(e) => handleInputChange('operating_hours', parseFloat(e.target.value))}
                  onFocus={e=>e.target.select()}
                  onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                  className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-lg font-semibold"
                />
                <p className="text-xs text-blue-600 mt-1">Heures de pompage par jour</p>
              </div>

              <div className="bg-gradient-to-r from-green-100 to-green-200 p-4 rounded-lg border-l-4 border-green-600">
                <label className="block text-sm font-medium text-green-800 mb-2">Débit calculé (m³/h)</label>
                <input
                  type="text" inputMode="decimal"
                  step="0.1"
                  value={solarData.flow_rate}
                  readOnly
                  className="w-full p-3 border-2 border-green-300 rounded-lg bg-green-50 text-lg font-bold text-green-800 cursor-not-allowed"
                
                  onFocus={e=>e.target.select()}
                  onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                />
                <p className="text-xs text-green-700 mt-1">Calculé automatiquement</p>
              </div>

              <div className="bg-white p-4 rounded-lg border-l-4 border-orange-500">
                <label className="block text-sm font-medium text-orange-700 mb-2">Variation saisonnière</label>
                <input
                  type="text" inputMode="decimal"
                  step="0.1"
                  value={solarData.seasonal_variation}
                  onChange={(e) => handleInputChange('seasonal_variation', parseFloat(e.target.value))}
                  onFocus={e=>e.target.select()}
                  onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
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
                  type="text" inputMode="decimal"
                  step="0.1"
                  value={solarData.dynamic_level}
                  onChange={(e) => handleInputChange('dynamic_level', parseFloat(e.target.value))}
                  onFocus={e=>e.target.select()}
                  onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                  className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-lg font-semibold"
                />
                <p className="text-xs text-blue-600 mt-1">Profondeur niveau d'eau</p>
              </div>

              <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                <label className="block text-sm font-medium text-blue-700 mb-2">Hauteur château (m)</label>
                <input
                  type="text" inputMode="decimal"
                  step="0.1"
                  value={solarData.tank_height}
                  onChange={(e) => handleInputChange('tank_height', parseFloat(e.target.value))}
                  onFocus={e=>e.target.select()}
                  onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                  className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-lg font-semibold"
                />
                <p className="text-xs text-blue-600 mt-1">Hauteur du réservoir/château</p>
              </div>

              <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-4 rounded-lg border-l-4 border-purple-600">
                <label className="block text-sm font-medium text-purple-800 mb-2">Hauteur géométrique (m)</label>
                <input
                  type="text" inputMode="decimal"
                  step="0.1"
                  value={solarData.static_head}
                  readOnly
                  className="w-full p-3 border-2 border-purple-300 rounded-lg bg-purple-50 text-lg font-bold text-purple-800 cursor-not-allowed"
                
                  onFocus={e=>e.target.select()}
                  onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                />
                <p className="text-xs text-purple-700 mt-1">Niveau + Château (auto)</p>
              </div>

              <div className="bg-white p-4 rounded-lg border-l-4 border-red-500">
                <label className="block text-sm font-medium text-red-700 mb-2">Pertes de charge (m)</label>
                <input
                  type="text" inputMode="decimal"
                  step="0.1"
                  value={solarData.dynamic_losses}
                  onChange={(e) => handleInputChange('dynamic_losses', parseFloat(e.target.value))}
                  onFocus={e=>e.target.select()}
                  onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
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
                  type="text" inputMode="decimal"
                  step="0.1"
                  value={solarData.useful_pressure_head}
                  onChange={(e) => handleInputChange('useful_pressure_head', parseFloat(e.target.value))}
                  onFocus={e=>e.target.select()}
                  onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                  className="w-full p-3 border-2 border-yellow-200 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 text-lg font-semibold"
                />
                <p className="text-xs text-yellow-600 mt-1">Pression résiduelle requise en sortie</p>
              </div>

              <div className="bg-gradient-to-r from-green-200 to-green-300 p-4 rounded-lg border-l-4 border-green-700 shadow-lg">
                <label className="block text-sm font-medium text-green-900 mb-2">🎯 HMT TOTALE (m)</label>
                <input
                  type="text" inputMode="decimal"
                  step="0.1"
                  value={solarData.total_head}
                  readOnly
                  className="w-full p-3 border-2 border-green-400 rounded-lg bg-green-100 text-2xl font-bold text-green-900 cursor-not-allowed text-center"
                
                  onFocus={e=>e.target.select()}
                  onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
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
                  onFocus={e=>e.target.select()}
                  onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
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
                    type="text" inputMode="decimal"
                    step="0.01"
                    value={solarData.electricity_cost}
                    onChange={(e) => handleInputChange('electricity_cost', parseFloat(e.target.value))}
                    onFocus={e=>e.target.select()}
                    onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durée projet (années)</label>
                  <input
                    type="text" inputMode="decimal"
                    value={solarData.project_lifetime}
                    onChange={(e) => handleInputChange('project_lifetime', parseInt(e.target.value))}
                    onFocus={e=>e.target.select()}
                    onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-200"
                    min="10" max="30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance annuelle (%)</label>
                  <input
                    type="text" inputMode="decimal"
                    step="0.01"
                    value={solarData.maintenance_cost_annual * 100}
                    onChange={(e) => handleInputChange('maintenance_cost_annual', parseFloat(e.target.value) / 100)}
                    onFocus={e=>e.target.select()}
                    onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
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
                    type="text" inputMode="decimal"
                    value={solarData.ambient_temperature_avg}
                    onChange={(e) => handleInputChange('ambient_temperature_avg', parseFloat(e.target.value))}
                    onFocus={e=>e.target.select()}
                    onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facteur poussière (0.9-1.0)</label>
                  <input
                    type="text" inputMode="decimal"
                    step="0.01"
                    min="0.8" max="1.0"
                    value={solarData.dust_factor}
                    onChange={(e) => handleInputChange('dust_factor', parseFloat(e.target.value))}
                    onFocus={e=>e.target.select()}
                    onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facteur ombrage (0.8-1.0)</label>
                  <input
                    type="text" inputMode="decimal"
                    step="0.01"
                    min="0.8" max="1.0"
                    value={solarData.shading_factor}
                    onChange={(e) => handleInputChange('shading_factor', parseFloat(e.target.value))}
                    onFocus={e=>e.target.select()}
                    onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
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
// ─────────────────────────────────────────────────────────────
// COMPOSANT PARTAGÉ : NumInput — champ numérique sans blocage
// Résout le problème du "0 qui reste" et du double-clic requis
// ─────────────────────────────────────────────────────────────
const NumInput = ({ value, onChange, step=1, min, max, placeholder, className, style, disabled }) => {
  const [raw, setRaw] = React.useState(value === null || value === undefined ? '' : String(value));
  // Sync si valeur externe change (ex: reset du formulaire)
  React.useEffect(() => {
    setRaw(value === null || value === undefined ? '' : String(value));
  }, [value]);
  const commit = (str) => {
    const n = parseFloat(str);
    if (!isNaN(n)) {
      if (min !== undefined && n < min) { onChange(min); setRaw(String(min)); return; }
      if (max !== undefined && n > max) { onChange(max); setRaw(String(max)); return; }
      onChange(n);
      setRaw(String(n));
    } else {
      // Valeur vide ou invalide → revenir à la dernière valeur valide
      setRaw(value === null || value === undefined ? '' : String(value));
    }
  };
  return (
    <input
      type="text"
      inputMode="decimal"
      value={raw}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      style={style}
      onChange={e => setRaw(e.target.value)}
      onBlur={e => commit(e.target.value)}
      onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); }}
      onFocus={e => e.target.select()}
    />
  );
};


// ════════════════════════════════════════════════════════════════
// STYLES PARTAGÉS — Design System ECO-PUMP AFRIK Pro
// ════════════════════════════════════════════════════════════════
const DS = {
  // Polices
  fontHead: "'Inter', 'Segoe UI', system-ui, sans-serif",
  fontMono: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
  // Couleurs
  blue:   { 50:'#eff6ff', 100:'#dbeafe', 500:'#3b82f6', 600:'#2563eb', 700:'#1d4ed8', 900:'#1e3a8a' },
  green:  { 50:'#f0fdf4', 100:'#dcfce7', 500:'#22c55e', 600:'#16a34a', 700:'#15803d' },
  red:    { 50:'#fff1f2', 100:'#ffe4e6', 500:'#ef4444', 600:'#dc2626', 700:'#b91c1c' },
  amber:  { 50:'#fffbeb', 100:'#fef3c7', 500:'#f59e0b', 600:'#d97706', 700:'#b45309' },
  purple: { 50:'#faf5ff', 100:'#f3e8ff', 500:'#a855f7', 600:'#9333ea', 700:'#7e22ce' },
  slate:  { 50:'#f8fafc', 100:'#f1f5f9', 200:'#e2e8f0', 300:'#cbd5e1', 400:'#94a3b8', 500:'#64748b', 700:'#334155', 900:'#0f172a' },
};

// Composant : Label + input stylé avec unité
const ProInput = ({ label, value, onChange, unit, note, warn, icon, min, max, step=1 }) => {
  const [raw, setRaw] = React.useState(value === null || value === undefined ? '' : String(value));
  React.useEffect(() => { setRaw(value === null || value === undefined ? '' : String(value)); }, [value]);
  const commit = str => {
    const n = parseFloat(str);
    if (!isNaN(n)) onChange(n);
    else setRaw(String(value ?? ''));
  };
  return (
    <div style={{ marginBottom: '0' }}>
      <label style={{ display:'block', fontSize:'0.72rem', fontWeight:600, color:'#475569', marginBottom:'4px', letterSpacing:'0.03em', textTransform:'uppercase' }}>
        {icon&&<span style={{marginRight:'5px'}}>{icon}</span>}{label}
        {unit&&<span style={{ color:'#94a3b8', fontWeight:400, textTransform:'none', marginLeft:'4px' }}>({unit})</span>}
      </label>
      <div style={{ position:'relative' }}>
        <input
          type="text" inputMode="decimal"
          value={raw}
          onChange={e=>setRaw(e.target.value)}
          onBlur={e=>commit(e.target.value)}
          onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
          onFocus={e=>e.target.select()}
          style={{
            width:'100%', boxSizing:'border-box',
            padding: unit ? '9px 44px 9px 12px' : '9px 12px',
            border: warn ? '1.5px solid #f59e0b' : '1.5px solid #e2e8f0',
            borderRadius:'8px',
            fontSize:'0.9rem', fontWeight:500, color:'#1e293b',
            background: warn ? '#fffbeb' : 'white',
            fontFamily: DS.fontMono,
            outline:'none',
            transition:'border-color 0.15s, box-shadow 0.15s',
          }}
          onFocusCapture={e=>{ e.target.style.borderColor='#3b82f6'; e.target.style.boxShadow='0 0 0 3px rgba(59,130,246,0.12)'; }}
          onBlurCapture={e=>{ e.target.style.borderColor=warn?'#f59e0b':'#e2e8f0'; e.target.style.boxShadow='none'; }}
        />
        {unit&&<span style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', fontSize:'0.75rem', color:'#94a3b8', fontWeight:600, pointerEvents:'none' }}>{unit}</span>}
      </div>
      {note&&<p style={{ fontSize:'0.67rem', color: warn?'#d97706':'#94a3b8', margin:'3px 0 0', fontStyle:'italic' }}>{note}</p>}
    </div>
  );
};

// Composant : Select stylé
const ProSelect = ({ label, value, onChange, options, icon }) => (
  <div>
    <label style={{ display:'block', fontSize:'0.72rem', fontWeight:600, color:'#475569', marginBottom:'4px', letterSpacing:'0.03em', textTransform:'uppercase' }}>
      {icon&&<span style={{marginRight:'5px'}}>{icon}</span>}{label}
    </label>
    <div style={{ position:'relative' }}>
      <select value={value} onChange={e=>onChange(e.target.value)}
        style={{ width:'100%', boxSizing:'border-box', padding:'9px 36px 9px 12px', border:'1.5px solid #e2e8f0', borderRadius:'8px', fontSize:'0.88rem', fontWeight:500, color:'#1e293b', background:'white', appearance:'none', cursor:'pointer', outline:'none' }}>
        {options.map(o => <option key={o.v||o} value={o.v||o}>{o.l||o}</option>)}
      </select>
      <span style={{ position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', color:'#94a3b8', pointerEvents:'none', fontSize:'10px' }}>▼</span>
    </div>
  </div>
);

// Composant : Alerte (danger / warning / info / success)
const ProAlert = ({ type='info', title, children, icon }) => {
  const cfg = {
    danger:  { bg:'#fff1f2', border:'#fca5a5', title:'#991b1b', text:'#dc2626', icon: icon||'🚨' },
    warning: { bg:'#fffbeb', border:'#fcd34d', title:'#92400e', text:'#d97706', icon: icon||'⚠️' },
    success: { bg:'#f0fdf4', border:'#86efac', title:'#14532d', text:'#16a34a', icon: icon||'✅' },
    info:    { bg:'#eff6ff', border:'#93c5fd', title:'#1e3a8a', text:'#2563eb', icon: icon||'💡' },
  }[type];
  return (
    <div style={{ background:cfg.bg, border:`1.5px solid ${cfg.border}`, borderRadius:'10px', padding:'12px 14px' }}>
      <div style={{ display:'flex', alignItems:'flex-start', gap:'10px' }}>
        <span style={{ fontSize:'1.1rem', marginTop:'1px', flexShrink:0 }}>{cfg.icon}</span>
        <div>
          {title&&<div style={{ fontSize:'0.8rem', fontWeight:700, color:cfg.title, marginBottom:'4px' }}>{title}</div>}
          <div style={{ fontSize:'0.78rem', color:cfg.text, lineHeight:1.6 }}>{children}</div>
        </div>
      </div>
    </div>
  );
};

// Composant : Carte de résultat KPI
const KPICard = ({ label, value, unit, sub, color='#2563eb', bg='#eff6ff', icon, big }) => (
  <div style={{ background:bg, borderRadius:'12px', padding: big?'16px 20px':'12px 16px', borderLeft:`4px solid ${color}`, display:'flex', flexDirection:'column', gap:'2px' }}>
    {icon&&<span style={{ fontSize:'1.2rem', marginBottom:'2px' }}>{icon}</span>}
    <div style={{ fontSize: big?'2rem':'1.5rem', fontWeight:800, color, fontFamily:DS.fontMono, lineHeight:1 }}>{value}</div>
    <div style={{ fontSize:'0.7rem', fontWeight:600, color, opacity:0.8 }}>{unit}</div>
    <div style={{ fontSize:'0.72rem', color:'#475569', fontWeight:500 }}>{label}</div>
    {sub&&<div style={{ fontSize:'0.65rem', color:'#94a3b8', marginTop:'2px' }}>{sub}</div>}
  </div>
);

// Composant : Section header stylé
const SectionHead = ({ icon, title, color='#2563eb', sub }) => (
  <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px', paddingBottom:'10px', borderBottom:`2px solid ${color}22` }}>
    <span style={{ fontSize:'1.3rem' }}>{icon}</span>
    <div>
      <div style={{ fontSize:'0.9rem', fontWeight:700, color:'#1e293b' }}>{title}</div>
      {sub&&<div style={{ fontSize:'0.7rem', color:'#94a3b8' }}>{sub}</div>}
    </div>
  </div>
);

// Composant : Card conteneur pro
const ProCard = ({ children, style={} }) => (
  <div style={{ background:'white', borderRadius:'14px', boxShadow:'0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)', border:'1px solid #f1f5f9', padding:'20px 22px', ...style }}>
    {children}
  </div>
);

// Composant : Séparateur section
const Divider = ({ label, color='#e2e8f0' }) => (
  <div style={{ display:'flex', alignItems:'center', gap:'10px', margin:'4px 0' }}>
    <div style={{ flex:1, height:'1px', background:color }}/>
    {label&&<span style={{ fontSize:'0.65rem', fontWeight:600, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.08em', whiteSpace:'nowrap' }}>{label}</span>}
    {label&&<div style={{ flex:1, height:'1px', background:color }}/>}
  </div>
);

// ════════════════════════════════════════════════════════════════
// NPSHd CALCULATOR — Design Pro
// ════════════════════════════════════════════════════════════════
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
    npsh_required: 3.5,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setInputData(p => ({ ...p, [k]: v }));

  const addFitting = () => setInputData(p => ({ ...p, suction_fittings: [...p.suction_fittings, { fitting_type: 'elbow_90', quantity: 1 }] }));
  const removeFitting = i => setInputData(p => ({ ...p, suction_fittings: p.suction_fittings.filter((_, j) => j !== i) }));
  const updFitting = (i, k, v) => setInputData(p => ({ ...p, suction_fittings: p.suction_fittings.map((f, j) => j===i ? {...f,[k]:v} : f) }));

  const calc = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API}/calculate-npshd`, inputData);
      setResult(res.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const isFlooded = inputData.suction_type === 'flooded';
  const vWarn = result && parseFloat(result.velocity) > 1.5;
  const cavRisk = result?.cavitation_risk;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'16px', fontFamily:DS.fontHead }}>

      {/* ── Bandeau titre ── */}
      <div style={{ background:'linear-gradient(135deg, #1e3a8a, #2563eb)', borderRadius:'14px', padding:'18px 24px', color:'white' }}>
        <div style={{ fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.12em', opacity:0.7, textTransform:'uppercase', marginBottom:'3px' }}>Module Hydraulique</div>
        <div style={{ fontSize:'1.25rem', fontWeight:800, marginBottom:'2px' }}>🔷 Calcul NPSHd</div>
        <div style={{ fontSize:'0.75rem', opacity:0.6 }}>Net Positive Suction Head Available — Prévention de la cavitation · ISO 9906</div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>

        {/* ── Colonne gauche : formulaire ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>

          {/* Config aspiration */}
          <ProCard>
            <SectionHead icon="⚙️" title="Configuration d'aspiration" color="#2563eb" sub="Type et géométrie de l'installation"/>
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <ProSelect label="Type d'aspiration" value={inputData.suction_type} icon="🔧"
                onChange={v=>set('suction_type',v)}
                options={[{v:'flooded',l:'① En charge (réservoir surélevé)'},{v:'suction_lift',l:'③ En dépression (aspiration montante)'}]}/>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                <ProInput label={isFlooded?'Hauteur eau / pompe':'Hauteur de levée'} value={inputData.hasp}
                  onChange={v=>set('hasp',v)} unit="m" icon="📐"
                  note={isFlooded?'Eau au-dessus de la pompe':'Pompe au-dessus de l\'eau'}
                  warn={!isFlooded && inputData.hasp > 6}/>
                <ProInput label="Débit de pompage" value={inputData.flow_rate}
                  onChange={v=>set('flow_rate',v)} unit="m³/h" icon="💧"/>
              </div>
              {!isFlooded && inputData.hasp > 6 && (
                <ProAlert type="warning" title="Hauteur d'aspiration élevée">
                  Hasp &gt; 6m augmente fortement le risque de cavitation. La hauteur maximale théorique est 10.3m (eau à 20°C). Recommandation : Hasp ≤ 5m.
                </ProAlert>
              )}
            </div>
          </ProCard>

          {/* Fluide */}
          <ProCard>
            <SectionHead icon="🧪" title="Fluide pompé" color="#7c3aed" sub="Propriétés physico-chimiques"/>
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <ProSelect label="Type de fluide" value={inputData.fluid_type} icon="💧"
                onChange={v=>set('fluid_type',v)}
                options={fluids.map(f=>({v:f.id,l:f.name}))}/>
              <ProInput label="Température" value={inputData.temperature}
                onChange={v=>set('temperature',v)} unit="°C" icon="🌡️"
                warn={inputData.temperature > 60}
                note={inputData.temperature > 60 ? 'Température élevée ↑ pression vapeur → risque cavitation accru' : 'La température influe sur Pv et ρ'}/>
              {inputData.temperature > 60 && (
                <ProAlert type="danger" title="Température critique">
                  Au-delà de 60°C, la pression de vapeur augmente significativement. Vérifiez la compatibilité des matériaux et le NPSHd calculé avec une marge supplémentaire (+1m).
                </ProAlert>
              )}
            </div>
          </ProCard>

          {/* Tuyauterie aspiration */}
          <ProCard>
            <SectionHead icon="🔩" title="Tuyauterie d'aspiration" color="#059669" sub="Diamètre, longueur, matériau"/>
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                <ProInput label="Diamètre DN" value={inputData.pipe_diameter}
                  onChange={v=>set('pipe_diameter',v)} unit="mm" icon="⌀"
                  warn={inputData.pipe_diameter < 50}
                  note={inputData.pipe_diameter < 50 ? 'DN trop faible → vitesse excessive' : ''}/>
                <ProInput label="Longueur" value={inputData.pipe_length}
                  onChange={v=>set('pipe_length',v)} unit="m" icon="📏"
                  warn={inputData.pipe_length > 20}
                  note={inputData.pipe_length > 20 ? 'Long. élev. → pertes de charge importantes' : ''}/>
              </div>
              <ProSelect label="Matériau" value={inputData.pipe_material} icon="🏗️"
                onChange={v=>set('pipe_material',v)}
                options={pipeMaterials.map(m=>({v:m.id,l:m.name}))}/>
              <ProInput label="NPSHr constructeur" value={inputData.npsh_required}
                onChange={v=>set('npsh_required',v)} unit="m" icon="📋"
                note="Valeur fournie par le fabricant de la pompe"/>
            </div>
          </ProCard>

          {/* Raccords */}
          <ProCard>
            <SectionHead icon="🔗" title="Raccords d'aspiration" color="#d97706" sub="Pertes de charge singulières"/>
            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              {inputData.suction_fittings.map((f, i) => (
                <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 70px 32px', gap:'6px', alignItems:'center' }}>
                  <select value={f.fitting_type} onChange={e=>updFitting(i,'fitting_type',e.target.value)}
                    style={{ padding:'7px 10px', border:'1.5px solid #e2e8f0', borderRadius:'7px', fontSize:'0.8rem', background:'white', outline:'none' }}>
                    {fittings.map(ft=><option key={ft.id} value={ft.id}>{ft.name}</option>)}
                  </select>
                  <input type="text" inputMode="decimal" value={f.quantity}
                    onChange={e=>updFitting(i,'quantity',parseInt(e.target.value)||1)}
                    onFocus={e=>e.target.select()}
                    style={{ padding:'7px 10px', border:'1.5px solid #e2e8f0', borderRadius:'7px', fontSize:'0.85rem', fontFamily:DS.fontMono, textAlign:'center', outline:'none' }}/>
                  <button onClick={()=>removeFitting(i)}
                    style={{ width:'32px', height:'34px', background:'#fff1f2', border:'1px solid #fca5a5', borderRadius:'7px', color:'#dc2626', cursor:'pointer', fontWeight:700, fontSize:'0.9rem' }}>×</button>
                </div>
              ))}
              <button onClick={addFitting}
                style={{ padding:'8px', background:'#eff6ff', border:'1.5px dashed #93c5fd', borderRadius:'8px', color:'#2563eb', cursor:'pointer', fontWeight:600, fontSize:'0.8rem', marginTop:'2px' }}>
                + Ajouter raccord
              </button>
            </div>
          </ProCard>

          {/* Bouton calcul */}
          <button onClick={calc} disabled={loading}
            style={{ padding:'14px', background: loading?'#94a3b8':'linear-gradient(135deg,#1d4ed8,#2563eb)', color:'white', border:'none', borderRadius:'10px', fontWeight:700, fontSize:'1rem', cursor:loading?'not-allowed':'pointer', fontFamily:DS.fontHead, boxShadow:'0 4px 12px rgba(37,99,235,0.3)', transition:'all 0.2s' }}>
            {loading ? '⏳ Calcul en cours…' : '🔷 Calculer NPSHd'}
          </button>
        </div>

        {/* ── Colonne droite : résultats ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>

          {/* Aperçu instantané */}
          <ProCard style={{ background:'linear-gradient(135deg,#f8fafc,#eff6ff)' }}>
            <SectionHead icon="📊" title="Données saisies" color="#64748b" sub="Récapitulatif en temps réel"/>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', fontSize:'0.8rem', color:'#475569' }}>
              {[
                ['Config', isFlooded?'En charge':'En dépression'],
                ['Hasp', `${inputData.hasp} m`],
                ['Débit', `${inputData.flow_rate} m³/h`],
                ['DN asp.', `${inputData.pipe_diameter} mm`],
                ['Longueur', `${inputData.pipe_length} m`],
                ['NPSHr', `${inputData.npsh_required} m`],
                ['Fluide', inputData.fluid_type],
                ['T°', `${inputData.temperature}°C`],
              ].map(([l,v]) => (
                <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'5px 8px', background:'white', borderRadius:'6px', border:'1px solid #e2e8f0' }}>
                  <span style={{ color:'#94a3b8', fontWeight:500 }}>{l}</span>
                  <span style={{ fontWeight:700, color:'#1e293b', fontFamily:DS.fontMono }}>{v}</span>
                </div>
              ))}
            </div>
          </ProCard>

          {!result && (
            <ProCard style={{ textAlign:'center', padding:'40px 20px', color:'#94a3b8' }}>
              <div style={{ fontSize:'3rem', marginBottom:'12px' }}>🔷</div>
              <div style={{ fontSize:'0.9rem', fontWeight:600, marginBottom:'4px', color:'#64748b' }}>En attente de calcul</div>
              <div style={{ fontSize:'0.75rem' }}>Renseignez les paramètres et cliquez sur Calculer</div>
            </ProCard>
          )}

          {result && (<>
            {/* Alerte cavitation */}
            {cavRisk ? (
              <ProAlert type="danger" title="⛔ RISQUE DE CAVITATION DÉTECTÉ">
                NPSHd ({result.npshd?.toFixed(2)}m) &lt; NPSHr ({result.npsh_required?.toFixed(2)}m). Marge = <strong>{result.npsh_margin?.toFixed(2)}m</strong>.
                La pompe est en danger — corriger l'installation immédiatement.
              </ProAlert>
            ) : (
              <ProAlert type="success" title="✅ Installation sécurisée">
                NPSHd ({result.npshd?.toFixed(2)}m) &gt; NPSHr ({result.npsh_required?.toFixed(2)}m). Marge = <strong>+{result.npsh_margin?.toFixed(2)}m</strong>. Aucun risque de cavitation.
              </ProAlert>
            )}

            {/* KPIs principaux */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
              <KPICard big icon="🔷" label="NPSHd calculé" value={result.npshd?.toFixed(2)} unit="m"
                color={cavRisk?'#dc2626':'#16a34a'} bg={cavRisk?'#fff1f2':'#f0fdf4'}
                sub={`NPSHr = ${result.npsh_required?.toFixed(2)} m`}/>
              <KPICard big icon="📐" label="Marge de sécurité" value={(result.npsh_margin>=0?'+':'')+result.npsh_margin?.toFixed(2)} unit="m"
                color={cavRisk?'#dc2626':result.npsh_margin<1?'#d97706':'#16a34a'}
                bg={cavRisk?'#fff1f2':result.npsh_margin<1?'#fffbeb':'#f0fdf4'}
                sub="Min. recommandé : +0.5m"/>
              <KPICard label="Vitesse aspiration" value={result.velocity?.toFixed(2)} unit="m/s"
                color={vWarn?'#d97706':'#2563eb'} bg={vWarn?'#fffbeb':'#eff6ff'} icon={vWarn?'⚠️':'💧'}
                sub={vWarn?'Vitesse élevée !':'Max rec. 1.5 m/s'}/>
              <KPICard label="Pertes de charge" value={result.total_head_loss?.toFixed(2)} unit="m"
                color="#7c3aed" bg="#faf5ff" icon="📉"
                sub={`Linéaires : ${result.linear_head_loss?.toFixed(2)}m`}/>
            </div>

            {/* Détail technique */}
            <ProCard>
              <SectionHead icon="🔬" title="Détail du calcul" color="#475569" sub="Paramètres intermédiaires"/>
              <div style={{ display:'flex', flexDirection:'column', gap:'6px', fontSize:'0.8rem' }}>
                {[
                  ['Pression atm.', `${(result.atmospheric_pressure/1000).toFixed(1)} kPa`],
                  ['Pression vapeur', `${(result.fluid_properties?.vapor_pressure/1000).toFixed(2)} kPa`],
                  ['Densité fluide', `${result.fluid_properties?.density?.toFixed(0)} kg/m³`],
                  ['Reynolds', `${result.reynolds_number?.toFixed(0)}`],
                  ['Coeff. friction λ', `${result.friction_factor?.toFixed(4)}`],
                  ['Pertes linéaires', `${result.linear_head_loss?.toFixed(2)} m`],
                  ['Pertes singulières', `${result.singular_head_loss?.toFixed(2)} m`],
                ].map(([l,v]) => (
                  <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom:'1px solid #f1f5f9' }}>
                    <span style={{ color:'#64748b' }}>{l}</span>
                    <span style={{ fontWeight:700, color:'#1e293b', fontFamily:DS.fontMono }}>{v}</span>
                  </div>
                ))}
              </div>
            </ProCard>

            {/* Warnings */}
            {result.warnings?.length > 0 && (
              <ProAlert type="warning" title="Avertissements">
                <ul style={{ margin:0, paddingLeft:'14px', display:'flex', flexDirection:'column', gap:'3px' }}>
                  {result.warnings.map((w,i) => <li key={i}>{w}</li>)}
                </ul>
              </ProAlert>
            )}

            {/* Recommandations */}
            {result.recommendations?.length > 0 && (
              <ProAlert type="info" title="Recommandations de correction">
                <ul style={{ margin:0, paddingLeft:'14px', display:'flex', flexDirection:'column', gap:'3px' }}>
                  {result.recommendations.map((r,i) => <li key={i}>{r}</li>)}
                </ul>
              </ProAlert>
            )}
          </>)}
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════
// HMT CALCULATOR — Design Pro
// ════════════════════════════════════════════════════════════════
const HMTCalculator = ({ fluids, pipeMaterials, fittings }) => {
  const [inputData, setInputData] = useState({
    installation_type: 'surface',
    suction_type: 'flooded',
    hasp: 3.0,
    discharge_height: 25,
    useful_pressure: 0,
    flow_rate: 50,
    fluid_type: 'water',
    temperature: 20,
    suction_pipe_diameter: 100,
    suction_pipe_length: 10,
    suction_pipe_material: 'pvc',
    discharge_pipe_diameter: 80,
    discharge_pipe_length: 50,
    discharge_pipe_material: 'pvc',
    suction_fittings: [],
    discharge_fittings: [],
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setInputData(p => ({...p,[k]:v}));
  const addF = side => setInputData(p => ({...p,[`${side}_fittings`]:[...p[`${side}_fittings`],{fitting_type:'elbow_90',quantity:1}]}));
  const remF = (side,i) => setInputData(p => ({...p,[`${side}_fittings`]:p[`${side}_fittings`].filter((_,j)=>j!==i)}));
  const updF = (side,i,k,v) => setInputData(p => ({...p,[`${side}_fittings`]:p[`${side}_fittings`].map((f,j)=>j===i?{...f,[k]:v}:f)}));

  const calc = async () => {
    setLoading(true);
    try { const r = await axios.post(`${API}/calculate-hmt`, inputData); setResult(r.data); }
    catch(e) { console.error(e); } finally { setLoading(false); }
  };

  const RaccordsSection = ({ side, label, color }) => (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
        <span style={{ fontSize:'0.72rem', fontWeight:700, color, textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</span>
        <button onClick={()=>addF(side)}
          style={{ padding:'4px 10px', background:color+'18', border:`1px solid ${color}44`, borderRadius:'6px', color, cursor:'pointer', fontWeight:600, fontSize:'0.72rem' }}>
          + Ajouter
        </button>
      </div>
      {inputData[`${side}_fittings`].map((f,i) => (
        <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 60px 30px', gap:'6px', marginBottom:'5px', alignItems:'center' }}>
          <select value={f.fitting_type} onChange={e=>updF(side,i,'fitting_type',e.target.value)}
            style={{ padding:'6px 9px', border:'1.5px solid #e2e8f0', borderRadius:'6px', fontSize:'0.78rem', outline:'none' }}>
            {fittings.map(ft=><option key={ft.id} value={ft.id}>{ft.name}</option>)}
          </select>
          <input type="text" inputMode="decimal" value={f.quantity}
            onChange={e=>updF(side,i,'quantity',parseInt(e.target.value)||1)} onFocus={e=>e.target.select()}
            style={{ padding:'6px', border:'1.5px solid #e2e8f0', borderRadius:'6px', fontSize:'0.82rem', textAlign:'center', fontFamily:DS.fontMono, outline:'none' }}/>
          <button onClick={()=>remF(side,i)}
            style={{ width:'30px', height:'30px', background:'#fff1f2', border:'1px solid #fca5a5', borderRadius:'6px', color:'#dc2626', cursor:'pointer', fontWeight:700 }}>×</button>
        </div>
      ))}
    </div>
  );

  const va = result?.velocity_suction; const vr = result?.velocity_discharge;
  const vaWarn = va && parseFloat(va) > 1.5; const vrWarn = vr && parseFloat(vr) > 3;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'16px', fontFamily:DS.fontHead }}>

      {/* Bandeau */}
      <div style={{ background:'linear-gradient(135deg,#065f46,#059669)', borderRadius:'14px', padding:'18px 24px', color:'white' }}>
        <div style={{ fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.12em', opacity:0.7, textTransform:'uppercase', marginBottom:'3px' }}>Module Hydraulique</div>
        <div style={{ fontSize:'1.25rem', fontWeight:800, marginBottom:'2px' }}>🔶 Calcul HMT</div>
        <div style={{ fontSize:'0.75rem', opacity:0.6 }}>Hauteur Manométrique Totale — Darcy-Weisbach · Colebrook-White · NF EN 806</div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>

        {/* Gauche */}
        <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>

          {/* Installation */}
          <ProCard>
            <SectionHead icon="🏗️" title="Type d'installation" color="#059669"/>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                <ProSelect label="Installation" value={inputData.installation_type} icon="⚙️"
                  onChange={v=>set('installation_type',v)}
                  options={[{v:'surface',l:'En surface'},{v:'forage',l:'Forage/Puits'},{v:'relevage',l:'Relevage'}]}/>
                <ProSelect label="Type aspiration" value={inputData.suction_type} icon="🔧"
                  onChange={v=>set('suction_type',v)}
                  options={[{v:'flooded',l:'En charge'},{v:'suction_lift',l:'En dépression'}]}/>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px' }}>
                <ProInput label="Hasp" value={inputData.hasp} onChange={v=>set('hasp',v)} unit="m"
                  warn={inputData.suction_type!=='flooded'&&inputData.hasp>6}/>
                <ProInput label="H. refoulement" value={inputData.discharge_height} onChange={v=>set('discharge_height',v)} unit="m"/>
                <ProInput label="P. utile" value={inputData.useful_pressure} onChange={v=>set('useful_pressure',v)} unit="bar"
                  note="0 si réseau libre"/>
              </div>
              <ProInput label="Débit" value={inputData.flow_rate} onChange={v=>set('flow_rate',v)} unit="m³/h" icon="💧"/>
            </div>
          </ProCard>

          {/* Fluide */}
          <ProCard>
            <SectionHead icon="🧪" title="Fluide" color="#7c3aed"/>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
              <ProSelect label="Type de fluide" value={inputData.fluid_type} onChange={v=>set('fluid_type',v)}
                options={fluids.map(f=>({v:f.id,l:f.name}))}/>
              <ProInput label="Température" value={inputData.temperature} onChange={v=>set('temperature',v)} unit="°C"
                warn={inputData.temperature>60}/>
            </div>
          </ProCard>

          {/* Tuyauterie aspiration */}
          <ProCard>
            <SectionHead icon="🔵" title="Tuyauterie aspiration" color="#2563eb" sub={`DN${inputData.suction_pipe_diameter} — ${inputData.suction_pipe_length}m`}/>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                <ProInput label="Diamètre DN" value={inputData.suction_pipe_diameter} onChange={v=>set('suction_pipe_diameter',v)} unit="mm" warn={inputData.suction_pipe_diameter<50}/>
                <ProInput label="Longueur" value={inputData.suction_pipe_length} onChange={v=>set('suction_pipe_length',v)} unit="m"/>
              </div>
              <ProSelect label="Matériau" value={inputData.suction_pipe_material} onChange={v=>set('suction_pipe_material',v)}
                options={pipeMaterials.map(m=>({v:m.id,l:m.name}))}/>
              <RaccordsSection side="suction" label="Raccords aspiration" color="#2563eb"/>
            </div>
          </ProCard>

          {/* Tuyauterie refoulement */}
          <ProCard>
            <SectionHead icon="🟢" title="Tuyauterie refoulement" color="#059669" sub={`DN${inputData.discharge_pipe_diameter} — ${inputData.discharge_pipe_length}m`}/>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                <ProInput label="Diamètre DN" value={inputData.discharge_pipe_diameter} onChange={v=>set('discharge_pipe_diameter',v)} unit="mm"/>
                <ProInput label="Longueur" value={inputData.discharge_pipe_length} onChange={v=>set('discharge_pipe_length',v)} unit="m"/>
              </div>
              <ProSelect label="Matériau" value={inputData.discharge_pipe_material} onChange={v=>set('discharge_pipe_material',v)}
                options={pipeMaterials.map(m=>({v:m.id,l:m.name}))}/>
              <RaccordsSection side="discharge" label="Raccords refoulement" color="#059669"/>
            </div>
          </ProCard>

          <button onClick={calc} disabled={loading}
            style={{ padding:'14px', background:loading?'#94a3b8':'linear-gradient(135deg,#065f46,#059669)', color:'white', border:'none', borderRadius:'10px', fontWeight:700, fontSize:'1rem', cursor:loading?'not-allowed':'pointer', fontFamily:DS.fontHead, boxShadow:'0 4px 12px rgba(5,150,105,0.3)' }}>
            {loading ? '⏳ Calcul en cours…' : '🔶 Calculer HMT'}
          </button>
        </div>

        {/* Droite : résultats */}
        <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>

          {/* Aperçu data */}
          <ProCard style={{ background:'linear-gradient(135deg,#f8fafc,#f0fdf4)' }}>
            <SectionHead icon="📋" title="Récapitulatif" color="#64748b"/>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px', fontSize:'0.78rem' }}>
              {[
                ['Débit Q', `${inputData.flow_rate} m³/h`],
                ['H. géo.', `${inputData.discharge_height} m`],
                ['Hasp', `${inputData.hasp} m`],
                ['P. utile', `${inputData.useful_pressure} bar`],
                ['ASP DN', `${inputData.suction_pipe_diameter}mm — ${inputData.suction_pipe_length}m`],
                ['REF DN', `${inputData.discharge_pipe_diameter}mm — ${inputData.discharge_pipe_length}m`],
              ].map(([l,v])=>(
                <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'5px 8px', background:'white', borderRadius:'5px', border:'1px solid #e2e8f0' }}>
                  <span style={{ color:'#94a3b8', fontWeight:500 }}>{l}</span>
                  <span style={{ fontWeight:700, color:'#1e293b', fontFamily:DS.fontMono, fontSize:'0.75rem' }}>{v}</span>
                </div>
              ))}
            </div>
          </ProCard>

          {/* Alertes vitesse (avant calcul) */}
          {inputData.flow_rate > 0 && (() => {
            const va = inputData.flow_rate / 3.6 / (Math.PI * (inputData.suction_pipe_diameter/1000/2)**2);
            const vr = inputData.flow_rate / 3.6 / (Math.PI * (inputData.discharge_pipe_diameter/1000/2)**2);
            return <>
              {va > 1.5 && <ProAlert type="warning" title="Vitesse aspiration élevée">Va ≈ {va.toFixed(2)} m/s &gt; 1.5 m/s recommandé. Augmentez le DN aspiration.</ProAlert>}
              {vr > 3.0 && <ProAlert type="warning" title="Vitesse refoulement élevée">Vr ≈ {vr.toFixed(2)} m/s &gt; 3.0 m/s recommandé. Augmentez le DN refoulement.</ProAlert>}
            </>;
          })()}

          {!result && (
            <ProCard style={{ textAlign:'center', padding:'40px 20px', color:'#94a3b8' }}>
              <div style={{ fontSize:'3rem', marginBottom:'12px' }}>🔶</div>
              <div style={{ fontSize:'0.9rem', fontWeight:600, color:'#64748b', marginBottom:'4px' }}>En attente de calcul</div>
              <div style={{ fontSize:'0.75rem' }}>Renseignez les données et cliquez sur Calculer HMT</div>
            </ProCard>
          )}

          {result && (<>
            {/* KPIs HMT */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
              <KPICard big icon="🔶" label="HMT totale" value={result.total_hmt?.toFixed(1)} unit="m"
                color="#059669" bg="#f0fdf4"/>
              <KPICard big icon="⚡" label="Puissance absorbée" value={result.absorbed_power?.toFixed(1)} unit="kW"
                color="#7c3aed" bg="#faf5ff"/>
              <KPICard label="Vitesse aspiration" value={result.velocity_suction?.toFixed(2)} unit="m/s"
                color={vaWarn?'#d97706':'#2563eb'} bg={vaWarn?'#fffbeb':'#eff6ff'}
                icon={vaWarn?'⚠️':'💧'} sub={vaWarn?'Trop élevée!':'≤ 1.5 m/s ✓'}/>
              <KPICard label="Vitesse refoulement" value={result.velocity_discharge?.toFixed(2)} unit="m/s"
                color={vrWarn?'#d97706':'#059669'} bg={vrWarn?'#fffbeb':'#f0fdf4'}
                icon={vrWarn?'⚠️':'🟢'} sub={vrWarn?'Trop élevée!':'≤ 3.0 m/s ✓'}/>
            </div>

            {/* Décomposition HMT */}
            <ProCard>
              <SectionHead icon="📊" title="Décomposition de la HMT" color="#059669"/>
              <div style={{ display:'flex', flexDirection:'column', gap:'5px', fontSize:'0.8rem' }}>
                {[
                  ['Hauteur géométrique', `${result.geometric_height?.toFixed(2)} m`, '#1e293b'],
                  ['J. aspiration (linéaires)', `${result.suction_linear_loss?.toFixed(3)} m`, '#2563eb'],
                  ['J. aspiration (singuliers)', `${result.suction_singular_loss?.toFixed(3)} m`, '#2563eb'],
                  ['J. refoulement (linéaires)', `${result.discharge_linear_loss?.toFixed(3)} m`, '#059669'],
                  ['J. refoulement (singuliers)', `${result.discharge_singular_loss?.toFixed(3)} m`, '#059669'],
                  ['Pression utile converti', `${(result.useful_pressure_head||0).toFixed(2)} m`, '#7c3aed'],
                ].map(([l,v,c])=>(
                  <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid #f1f5f9' }}>
                    <span style={{ color:'#64748b' }}>{l}</span>
                    <span style={{ fontWeight:700, color:c, fontFamily:DS.fontMono }}>{v}</span>
                  </div>
                ))}
                <div style={{ display:'flex', justifyContent:'space-between', padding:'8px', background:'#f0fdf4', borderRadius:'7px', marginTop:'4px', border:'1.5px solid #86efac' }}>
                  <span style={{ fontWeight:700, color:'#065f46' }}>= HMT TOTALE</span>
                  <span style={{ fontWeight:800, color:'#059669', fontFamily:DS.fontMono, fontSize:'1rem' }}>{result.total_hmt?.toFixed(2)} m</span>
                </div>
              </div>
            </ProCard>

            {/* Alertes résultats */}
            {result.warnings?.length > 0 && (
              <ProAlert type="warning" title="Avertissements">
                <ul style={{ margin:0, paddingLeft:'14px' }}>
                  {result.warnings.map((w,i)=><li key={i}>{w}</li>)}
                </ul>
              </ProAlert>
            )}
            {result.recommendations?.length > 0 && (
              <ProAlert type="info" title="Recommandations">
                <ul style={{ margin:0, paddingLeft:'14px' }}>
                  {result.recommendations.map((r,i)=><li key={i}>{r}</li>)}
                </ul>
              </ProAlert>
            )}
          </>)}
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════
// PERFORMANCE ANALYSIS — Design Pro
// ════════════════════════════════════════════════════════════════
const PerformanceAnalysis = ({ fluids, pipeMaterials }) => {
  const [inputData, setInputData] = useState({
    flow_rate: 50,
    hmt: 25,
    pipe_diameter: 100,
    fluid_type: 'water',
    pipe_material: 'pvc',
    temperature: 20,
    pump_efficiency: 75,
    motor_efficiency: 90,
    power_input: null,
    hydraulic_power: null,
    starting_method: 'star_delta',
    power_factor: 0.8,
    cable_length: 50,
    cable_material: 'copper',
    voltage: '400V',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setInputData(p => ({...p,[k]:v}));

  const calc = async () => {
    setLoading(true);
    try { const r = await axios.post(`${API}/analyze-performance`, inputData); setResult(r.data); }
    catch(e) { console.error(e); } finally { setLoading(false); }
  };

  const effWarn = inputData.pump_efficiency < 60;
  const effGood = inputData.pump_efficiency >= 75;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'16px', fontFamily:DS.fontHead }}>

      {/* Bandeau */}
      <div style={{ background:'linear-gradient(135deg,#92400e,#d97706)', borderRadius:'14px', padding:'18px 24px', color:'white' }}>
        <div style={{ fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.12em', opacity:0.7, textTransform:'uppercase', marginBottom:'3px' }}>Module Analyse</div>
        <div style={{ fontSize:'1.25rem', fontWeight:800, marginBottom:'2px' }}>📊 Analyse de Performance</div>
        <div style={{ fontSize:'0.75rem', opacity:0.6 }}>Rendement · Puissance · Courbes · Câblage électrique · IEC 60034</div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>

        {/* Gauche */}
        <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>

          {/* Hydraulique */}
          <ProCard>
            <SectionHead icon="💧" title="Paramètres hydrauliques" color="#2563eb"/>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                <ProInput label="Débit Q" value={inputData.flow_rate} onChange={v=>set('flow_rate',v)} unit="m³/h" icon="💧"/>
                <ProInput label="HMT" value={inputData.hmt} onChange={v=>set('hmt',v)} unit="m" icon="📐"/>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                <ProInput label="DN tuyauterie" value={inputData.pipe_diameter} onChange={v=>set('pipe_diameter',v)} unit="mm"/>
                <ProInput label="Température" value={inputData.temperature} onChange={v=>set('temperature',v)} unit="°C"/>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                <ProSelect label="Fluide" value={inputData.fluid_type} onChange={v=>set('fluid_type',v)}
                  options={fluids.map(f=>({v:f.id,l:f.name}))}/>
                <ProSelect label="Matériau" value={inputData.pipe_material} onChange={v=>set('pipe_material',v)}
                  options={pipeMaterials.map(m=>({v:m.id,l:m.name}))}/>
              </div>
            </div>
          </ProCard>

          {/* Rendements */}
          <ProCard>
            <SectionHead icon="⚡" title="Rendements & Puissance" color="#d97706" sub="IEC 60034 — IE2/IE3"/>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                <ProInput label="η pompe" value={inputData.pump_efficiency} onChange={v=>set('pump_efficiency',v)} unit="%" icon="🔄"
                  warn={effWarn}
                  note={effWarn?'Rendement faible — pompe dégradée?':effGood?'Bon rendement ✓':'Rendement moyen'}/>
                <ProInput label="η moteur" value={inputData.motor_efficiency} onChange={v=>set('motor_efficiency',v)} unit="%" icon="🔌"/>
              </div>
              {effWarn && <ProAlert type="warning" title="Rendement pompe faible">
                ηp &lt; 60% indique une pompe hors de son point de fonctionnement optimal ou usée. Vérifiez l'impulseur et les joints d'étanchéité.
              </ProAlert>}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                <ProInput label="P1 absorbée" value={inputData.power_input||''} onChange={v=>set('power_input',v||null)} unit="kW"
                  note="Optionnel — mesure réelle"/>
                <ProInput label="P2 hydraulique" value={inputData.hydraulic_power||''} onChange={v=>set('hydraulic_power',v||null)} unit="kW"
                  note="Optionnel — mesure réelle"/>
              </div>
            </div>
          </ProCard>

          {/* Électrique */}
          <ProCard>
            <SectionHead icon="⚡" title="Paramètres électriques" color="#7c3aed" sub="Câblage & démarrage"/>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                <ProSelect label="Méthode démarrage" value={inputData.starting_method} onChange={v=>set('starting_method',v)}
                  options={[{v:'direct',l:'Direct (DOL)'},{v:'star_delta',l:'Étoile-Triangle'},{v:'soft_starter',l:'Démarreur progressif'},{v:'vfd',l:'Variateur (VFD)'}]}/>
                <ProSelect label="Tension réseau" value={inputData.voltage} onChange={v=>set('voltage',v)}
                  options={['400V','230V','380V','660V'].map(v=>({v,l:v+' — 50Hz'}))}/>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px' }}>
                <ProInput label="cos φ" value={inputData.power_factor} onChange={v=>set('power_factor',v)} icon="φ"
                  note="0.7 → 0.9 typique"/>
                <ProInput label="Long. câble" value={inputData.cable_length} onChange={v=>set('cable_length',v)} unit="m"/>
                <ProSelect label="Matériau" value={inputData.cable_material} onChange={v=>set('cable_material',v)}
                  options={[{v:'copper',l:'Cuivre'},{v:'aluminum',l:'Aluminium'}]}/>
              </div>
            </div>
          </ProCard>

          <button onClick={calc} disabled={loading}
            style={{ padding:'14px', background:loading?'#94a3b8':'linear-gradient(135deg,#92400e,#d97706)', color:'white', border:'none', borderRadius:'10px', fontWeight:700, fontSize:'1rem', cursor:loading?'not-allowed':'pointer', boxShadow:'0 4px 12px rgba(217,119,6,0.3)' }}>
            {loading ? '⏳ Analyse en cours…' : '📊 Analyser Performance'}
          </button>
        </div>

        {/* Droite */}
        <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>

          {/* Indicateur rendement en temps réel */}
          <ProCard>
            <SectionHead icon="🎯" title="Indicateur rendement" color="#d97706" sub="Mise à jour en temps réel"/>
            {(()=>{
              const eff = inputData.pump_efficiency;
              const color = eff >= 75 ? '#16a34a' : eff >= 60 ? '#d97706' : '#dc2626';
              const label = eff >= 75 ? 'Excellent' : eff >= 60 ? 'Moyen' : 'Faible';
              return (
                <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:'0.75rem', color:'#64748b' }}>η pompe</span>
                    <span style={{ fontSize:'1.2rem', fontWeight:800, color, fontFamily:DS.fontMono }}>{eff}%</span>
                  </div>
                  <div style={{ height:'10px', background:'#f1f5f9', borderRadius:'99px', overflow:'hidden' }}>
                    <div style={{ width:`${eff}%`, height:'100%', background:`linear-gradient(90deg, #dc2626, #d97706 50%, #16a34a)`, transition:'width 0.4s ease', borderRadius:'99px' }}/>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.65rem', color:'#94a3b8' }}>
                    <span>0%</span><span style={{color}}>◀ {label} ▶</span><span>100%</span>
                  </div>
                  {/* Puissance hydraulique estimée */}
                  {(()=>{
                    const ph = (inputData.flow_rate * 9.81 * 1000 * inputData.hmt) / (3600 * 1000);
                    const pa = ph / (inputData.pump_efficiency/100 * inputData.motor_efficiency/100);
                    return (
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px', marginTop:'4px' }}>
                        <div style={{ padding:'8px', background:'#eff6ff', borderRadius:'7px', textAlign:'center' }}>
                          <div style={{ fontSize:'1.1rem', fontWeight:800, color:'#2563eb', fontFamily:DS.fontMono }}>{ph.toFixed(2)}</div>
                          <div style={{ fontSize:'0.65rem', color:'#2563eb' }}>kW hydraulique Ph</div>
                        </div>
                        <div style={{ padding:'8px', background:'#faf5ff', borderRadius:'7px', textAlign:'center' }}>
                          <div style={{ fontSize:'1.1rem', fontWeight:800, color:'#7c3aed', fontFamily:DS.fontMono }}>{pa.toFixed(2)}</div>
                          <div style={{ fontSize:'0.65rem', color:'#7c3aed' }}>kW absorbée Pa</div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              );
            })()}
          </ProCard>

          {!result && (
            <ProCard style={{ textAlign:'center', padding:'40px 20px', color:'#94a3b8' }}>
              <div style={{ fontSize:'3rem', marginBottom:'12px' }}>📊</div>
              <div style={{ fontSize:'0.9rem', fontWeight:600, color:'#64748b', marginBottom:'4px' }}>En attente d'analyse</div>
              <div style={{ fontSize:'0.75rem' }}>Renseignez les données et cliquez sur Analyser Performance</div>
            </ProCard>
          )}

          {result && (<>
            {/* KPIs */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
              <KPICard big icon="⚡" label="Puissance absorbée" value={result.absorbed_power?.toFixed(2)} unit="kW"
                color="#7c3aed" bg="#faf5ff"/>
              <KPICard big icon="🔄" label="Rendement global" value={result.overall_efficiency?.toFixed(1)} unit="%"
                color={result.overall_efficiency>=60?'#16a34a':'#dc2626'}
                bg={result.overall_efficiency>=60?'#f0fdf4':'#fff1f2'}/>
              <KPICard label="Courant nominal" value={result.nominal_current?.toFixed(1)} unit="A"
                color="#d97706" bg="#fffbeb" icon="⚡"/>
              <KPICard label="Section câble" value={result.cable_section} unit="mm²"
                color="#059669" bg="#f0fdf4" icon="🔌"/>
            </div>

            {/* Détail électrique */}
            <ProCard>
              <SectionHead icon="🔌" title="Analyse électrique" color="#7c3aed"/>
              <div style={{ display:'flex', flexDirection:'column', gap:'5px', fontSize:'0.8rem' }}>
                {[
                  ['Puissance hydraulique Ph', `${result.hydraulic_power?.toFixed(3)} kW`, '#2563eb'],
                  ['Puissance mécanique Pm', `${result.mechanical_power?.toFixed(3)} kW`, '#059669'],
                  ['Puissance absorbée P1', `${result.absorbed_power?.toFixed(2)} kW`, '#7c3aed'],
                  ['Courant nominal In', `${result.nominal_current?.toFixed(1)} A`, '#d97706'],
                  ['Courant démarrage Id', result.starting_current?`${result.starting_current?.toFixed(0)} A`:'—', '#dc2626'],
                  ['Section câble recommandée', `${result.cable_section} mm²`, '#059669'],
                  ['Chute de tension', `${result.voltage_drop?.toFixed(2)} V (${result.voltage_drop_percent?.toFixed(1)}%)`, result.voltage_drop_percent>3?'#dc2626':'#1e293b'],
                ].map(([l,v,c])=>(
                  <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom:'1px solid #f1f5f9' }}>
                    <span style={{ color:'#64748b' }}>{l}</span>
                    <span style={{ fontWeight:700, color:c, fontFamily:DS.fontMono }}>{v}</span>
                  </div>
                ))}
              </div>
              {result.voltage_drop_percent > 3 && (
                <ProAlert type="danger" title="Chute de tension excessive" style={{marginTop:'10px'}}>
                  ΔU = {result.voltage_drop_percent?.toFixed(1)}% &gt; 3% autorisé (NF C 15-100). Augmentez la section de câble ou réduisez la longueur.
                </ProAlert>
              )}
            </ProCard>

            {/* Recommendations */}
            {result.recommendations?.length > 0 && (
              <ProAlert type="info" title="Recommandations d'optimisation">
                <ul style={{ margin:0, paddingLeft:'14px', lineHeight:1.7 }}>
                  {result.recommendations.map((r,i)=><li key={i}>{r}</li>)}
                </ul>
              </ProAlert>
            )}

            {/* Alertes */}
            {result.warnings?.length > 0 && (
              <ProAlert type="warning" title="Points d'attention">
                <ul style={{ margin:0, paddingLeft:'14px' }}>
                  {result.warnings.map((w,i)=><li key={i}>{w}</li>)}
                </ul>
              </ProAlert>
            )}
          </>)}
        </div>
      </div>
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
                      type="text" inputMode="decimal"
                      value={inputData.flow_rate || ''}
                      onChange={(e) => handleInputChange('flow_rate', parseFloat(e.target.value) || 0)}
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                      className="w-full p-2 border-2 border-yellow-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-yellow-50"
                      placeholder="Saisissez le débit"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ⭐ Température (°C)
                    </label>
                    <input
                      type="text" inputMode="decimal"
                      value={inputData.temperature || ''}
                      onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value) || 0)}
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
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
                      type="text" inputMode="decimal"
                      step="0.1"
                      value={inputData.suction_height !== undefined && inputData.suction_height !== null ? inputData.suction_height : ''}
                      onChange={(e) => handleInputChange('suction_height', e.target.value === '' ? '' : parseFloat(e.target.value))}
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
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
                      type="text" inputMode="decimal"
                      step="0.1"
                      value={inputData.discharge_height !== undefined && inputData.discharge_height !== null ? inputData.discharge_height : ''}
                      onChange={(e) => handleInputChange('discharge_height', e.target.value === '' ? '' : parseFloat(e.target.value))}
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
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
                    type="text" inputMode="decimal"
                    step="0.1"
                    value={inputData.useful_pressure || ''}
                    onChange={(e) => handleInputChange('useful_pressure', parseFloat(e.target.value) || 0)}
                    onFocus={e=>e.target.select()}
                    onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
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
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
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
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
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
                      type="text" inputMode="decimal"
                      value={inputData.suction_length !== undefined && inputData.suction_length !== null ? inputData.suction_length : ''}
                      onChange={(e) => handleInputChange('suction_length', e.target.value === '' ? '' : parseFloat(e.target.value))}
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Longueur aspiration"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Long. Ref. (m)
                    </label>
                    <input
                      type="text" inputMode="decimal"
                      value={inputData.discharge_length !== undefined && inputData.discharge_length !== null ? inputData.discharge_length : ''}
                      onChange={(e) => handleInputChange('discharge_length', e.target.value === '' ? '' : parseFloat(e.target.value))}
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
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
                    type="text" inputMode="decimal"
                    step="0.1"
                    value={inputData.npsh_required !== undefined && inputData.npsh_required !== null ? inputData.npsh_required : ''}
                    onChange={(e) => handleInputChange('npsh_required', e.target.value === '' ? '' : parseFloat(e.target.value))}
                    onFocus={e=>e.target.select()}
                    onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
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
                      type="text" inputMode="decimal"
                      min="0"
                      value={inputData.suction_elbow_90}
                      onChange={(e) => handleInputChange('suction_elbow_90', parseInt(e.target.value) || 0)}
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Coudes 45°</label>
                    <input
                      type="text" inputMode="decimal"
                      min="0"
                      value={inputData.suction_elbow_45}
                      onChange={(e) => handleInputChange('suction_elbow_45', parseInt(e.target.value) || 0)}
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Coudes 30°</label>
                    <input
                      type="text" inputMode="decimal"
                      min="0"
                      value={inputData.suction_elbow_30}
                      onChange={(e) => handleInputChange('suction_elbow_30', parseInt(e.target.value) || 0)}
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Crépine</label>
                    <input
                      type="text" inputMode="decimal"
                      min="0"
                      value={inputData.suction_strainer}
                      onChange={(e) => handleInputChange('suction_strainer', parseInt(e.target.value) || 0)}
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                {/* Tés et raccords aspiration */}
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Té (passage)</label>
                    <input
                      type="text" inputMode="decimal"
                      min="0"
                      value={inputData.suction_tee_flow}
                      onChange={(e) => handleInputChange('suction_tee_flow', parseInt(e.target.value) || 0)}
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Té (dérivation)</label>
                    <input
                      type="text" inputMode="decimal"
                      min="0"
                      value={inputData.suction_tee_branch}
                      onChange={(e) => handleInputChange('suction_tee_branch', parseInt(e.target.value) || 0)}
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Réduction grad.</label>
                    <input
                      type="text" inputMode="decimal"
                      min="0"
                      value={inputData.suction_reducer_gradual}
                      onChange={(e) => handleInputChange('suction_reducer_gradual', parseInt(e.target.value) || 0)}
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Réduction brusque</label>
                    <input
                      type="text" inputMode="decimal"
                      min="0"
                      value={inputData.suction_reducer_sudden}
                      onChange={(e) => handleInputChange('suction_reducer_sudden', parseInt(e.target.value) || 0)}
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                {/* Vannes aspiration */}
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">V. à opercule</label>
                    <input
                      type="text" inputMode="decimal"
                      min="0"
                      value={inputData.suction_gate_valve}
                      onChange={(e) => handleInputChange('suction_gate_valve', parseInt(e.target.value) || 0)}
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">V. à boisseau</label>
                    <input
                      type="text" inputMode="decimal"
                      min="0"
                      value={inputData.suction_ball_valve}
                      onChange={(e) => handleInputChange('suction_ball_valve', parseInt(e.target.value) || 0)}
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Clapet A.R.</label>
                    <input
                      type="text" inputMode="decimal"
                      min="0"
                      value={inputData.suction_check_valve}
                      onChange={(e) => handleInputChange('suction_check_valve', parseInt(e.target.value) || 0)}
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Clapet de pied</label>
                    <input
                      type="text" inputMode="decimal"
                      min="0"
                      value={inputData.suction_foot_valve}
                      onChange={(e) => handleInputChange('suction_foot_valve', parseInt(e.target.value) || 0)}
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
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
                      type="text" inputMode="decimal"
                      min="0"
                      value={inputData.discharge_elbow_90}
                      onChange={(e) => handleInputChange('discharge_elbow_90', parseInt(e.target.value) || 0)}
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Coudes 45°</label>
                    <input
                      type="text" inputMode="decimal"
                      min="0"
                      value={inputData.discharge_elbow_45}
                      onChange={(e) => handleInputChange('discharge_elbow_45', parseInt(e.target.value) || 0)}
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Coudes 30°</label>
                    <input
                      type="text" inputMode="decimal"
                      min="0"
                      value={inputData.discharge_elbow_30}
                      onChange={(e) => handleInputChange('discharge_elbow_30', parseInt(e.target.value) || 0)}
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Té (passage)</label>
                    <input
                      type="text" inputMode="decimal"
                      min="0"
                      value={inputData.discharge_tee_flow}
                      onChange={(e) => handleInputChange('discharge_tee_flow', parseInt(e.target.value) || 0)}
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                {/* Vannes refoulement */}
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">V. à opercule</label>
                    <input
                      type="text" inputMode="decimal"
                      min="0"
                      value={inputData.discharge_gate_valve}
                      onChange={(e) => handleInputChange('discharge_gate_valve', parseInt(e.target.value) || 0)}
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">V. à boisseau</label>
                    <input
                      type="text" inputMode="decimal"
                      min="0"
                      value={inputData.discharge_ball_valve}
                      onChange={(e) => handleInputChange('discharge_ball_valve', parseInt(e.target.value) || 0)}
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">V. papillon</label>
                    <input
                      type="text" inputMode="decimal"
                      min="0"
                      value={inputData.discharge_butterfly_valve}
                      onChange={(e) => handleInputChange('discharge_butterfly_valve', parseInt(e.target.value) || 0)}
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Clapet A.R.</label>
                    <input
                      type="text" inputMode="decimal"
                      min="0"
                      value={inputData.discharge_check_valve}
                      onChange={(e) => handleInputChange('discharge_check_valve', parseInt(e.target.value) || 0)}
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                {/* Accessoires refoulement */}
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Réduction grad.</label>
                    <input
                      type="text" inputMode="decimal"
                      min="0"
                      value={inputData.discharge_reducer_gradual}
                      onChange={(e) => handleInputChange('discharge_reducer_gradual', parseInt(e.target.value) || 0)}
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Débitmètre</label>
                    <input
                      type="text" inputMode="decimal"
                      min="0"
                      value={inputData.discharge_flow_meter}
                      onChange={(e) => handleInputChange('discharge_flow_meter', parseInt(e.target.value) || 0)}
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Manomètre</label>
                    <input
                      type="text" inputMode="decimal"
                      min="0"
                      value={inputData.discharge_pressure_gauge}
                      onChange={(e) => handleInputChange('discharge_pressure_gauge', parseInt(e.target.value) || 0)}
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Filtre</label>
                    <input
                      type="text" inputMode="decimal"
                      min="0"
                      value={inputData.discharge_strainer}
                      onChange={(e) => handleInputChange('discharge_strainer', parseInt(e.target.value) || 0)}
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
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
                      type="text" inputMode="decimal"
                      min="40"
                      max="95"
                      value={inputData.pump_efficiency || ''}
                      onChange={(e) => handleInputChange('pump_efficiency', parseFloat(e.target.value) || 0)}
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                      className="w-full p-2 border-2 border-yellow-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-yellow-50"
                      placeholder="75"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ⭐ Rendement Moteur (%)
                    </label>
                    <input
                      type="text" inputMode="decimal"
                      min="70"
                      max="98"
                      value={inputData.motor_efficiency || ''}
                      onChange={(e) => handleInputChange('motor_efficiency', parseFloat(e.target.value) || 0)}
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
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
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
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
                      type="text" inputMode="decimal"
                      min="0.6"
                      max="1"
                      step="0.01"
                      value={inputData.power_factor}
                      onChange={(e) => handleInputChange('power_factor', parseFloat(e.target.value) || 0)}
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
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
                      type="text" inputMode="decimal"
                      value={inputData.cable_length || ''}
                      onChange={(e) => handleInputChange('cable_length', parseFloat(e.target.value) || 0)}
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
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
                    type="text" inputMode="decimal"
                    step="0.1"
                    min="0"
                    max="10"
                    value={inputData.voltage_drop || ''}
                    onChange={(e) => handleInputChange('voltage_drop', parseFloat(e.target.value) || 0)}
                    onFocus={e=>e.target.select()}
                    onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
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
                      type="text" inputMode="decimal"
                      value={inputData.operating_hours || ''}
                      onChange={(e) => handleInputChange('operating_hours', parseFloat(e.target.value) || 0)}
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Heures de fonctionnement annuel"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix kWh (FCFA)
                    </label>
                    <input
                      type="text" inputMode="decimal"
                      step="0.1"
                      value={inputData.electricity_cost || ''}
                      onChange={(e) => handleInputChange('electricity_cost', parseFloat(e.target.value) || 0)}
                      onFocus={e=>e.target.select()}
                      onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
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



// ============================================================
// OUTIL DESSIN 2D v4 — SCHÉMAS TECHNIQUES NORMALISÉS
// ============================================================
const DrawingTool = () => {
  const [step, setStep] = useState(1);
  const [cfg, setCfg] = useState({
    type: 'surface', asp: 'flooded', np: 1, ns: 0,
    Q: 50, h_geo: 25, hasp: 3, l_asp: 20, dn_asp: 100, mat_asp: 'PVC',
    l_ref: 50, dn_ref: 80, mat_ref: 'Acier', res_P: 0, npsh_req: 3.5,
    Q_f: 10, nd: 30, hch: 10, l_f: 80, res_f: 0.5, dn_f: 80, mat_f: 'PEHD',
    Q_r: 30, h_r: 15, dn_r: 80, l_r: 40,
    fluid: 'Eau', temp: 20, volt: '400V - 50Hz', prot: 'IP65',
    proj: 'Mon Installation', date: new Date().toLocaleDateString('fr-FR'),
  });
  const [acc, setAcc] = useState({
    mano_asp:true, mano_ref:true, debit:false, cap_p:false,
    v_asp:true, v_ref:true, clapet:true, soupape:false,
    crepine:true, jt_dil:false, vv:false, manifold:false,
    coffret:true, vfd:false, fl_h:true, fl_b:true,
  });
  const [step4, setStep4] = useState(false);
  const S = (k,v) => setCfg(p=>({...p,[k]:v}));
  const T = k => setAcc(p=>({...p,[k]:!p[k]}));
  const t = cfg.type;

  const TYPES = [
    {id:'surface',   label:'Surface / Bâche',  icon:'🏗️', hasAsp:true,  maxP:4},
    {id:'surpression',label:'Surpression',      icon:'💨', hasAsp:true,  maxP:4},
    {id:'incendie',  label:'Incendie',          icon:'🔥', hasAsp:true,  maxP:2},
    {id:'relevage',  label:'Relevage',          icon:'⬆️', hasAsp:false, maxP:3},
    {id:'forage',    label:'Forage / Puits',    icon:'🕳️', hasAsp:false, maxP:1},
  ];
  const CT = TYPES.find(x=>x.id===t)||TYPES[0];
  const maxP = CT.maxP;
  const standby = [0,1,2].filter(n => n + cfg.np <= maxP);

  // ── Calculs hydrauliques ──
  const hyd = () => {
    const g=9.81, rho=1000;
    const darcy = (Q,d,L) => {
      if(!Q||!d||!L) return 0;
      const A=Math.PI*(d/2000)**2, V=(Q/3600)/A;
      const Re=V*(d/1000)/1e-6;
      const f=Re>2300?0.316/Re**0.25:64/Math.max(Re,1);
      return f*(L/(d/1000))*(V*V)/(2*g);
    };
    if(t==='forage'){
      const Hg=+cfg.nd + +cfg.hch;
      const Jr=darcy(cfg.Q_f,cfg.dn_f,cfg.l_f);
      const HMT=Hg+Jr+ +cfg.res_f*1e5/(rho*g);
      const A=Math.PI*(cfg.dn_f/2000)**2, V=(cfg.Q_f/3600)/A;
      const Ph=rho*g*(cfg.Q_f/3600)*HMT/1000;
      return {HMT:HMT.toFixed(1),Pa:(Ph/0.65).toFixed(1),Ph:Ph.toFixed(2),V:V.toFixed(2),Jr:Jr.toFixed(2),Hg:Hg.toFixed(0)};
    }
    if(t==='relevage'){
      const Jr=darcy(cfg.Q_r,cfg.dn_r,cfg.l_r);
      const HMT= +cfg.h_r+Jr;
      const A=Math.PI*(cfg.dn_r/2000)**2, V=(cfg.Q_r/3600)/A;
      const Ph=rho*g*(cfg.Q_r/3600)*HMT/1000;
      return {HMT:HMT.toFixed(1),Pa:(Ph/0.70).toFixed(1),Ph:Ph.toFixed(2),V:V.toFixed(2),Jr:Jr.toFixed(2)};
    }
    const Ja=darcy(cfg.Q,cfg.dn_asp,cfg.l_asp);
    const Jr=darcy(cfg.Q,cfg.dn_ref,cfg.l_ref);
    const Aa=Math.PI*(cfg.dn_asp/2000)**2, Va=(cfg.Q/3600)/Aa;
    const Ar=Math.PI*(cfg.dn_ref/2000)**2, Vr=(cfg.Q/3600)/Ar;
    const HMT= +cfg.h_geo+Ja+Jr+ +cfg.res_P*1e5/(rho*g);
    const pa_atm=10.33, pv=0.24;
    const hs=cfg.asp==='flooded'? +cfg.hasp : - +cfg.hasp;
    const NPSHd=pa_atm+hs-pv-Ja;
    const Ph=rho*g*(cfg.Q/3600)*HMT/1000;
    return {HMT:HMT.toFixed(1),Pa:(Ph/0.75).toFixed(1),Ph:Ph.toFixed(2),Va:Va.toFixed(2),Vr:Vr.toFixed(2),Ja:Ja.toFixed(2),Jr:Jr.toFixed(2),NPSHd:NPSHd.toFixed(2),cav:NPSHd<cfg.npsh_req};
  };
  const H = hyd();

  // ── Symboles normalisés ISO 1219 / EN ISO 10628 ──
  // Pompe centrifuge : cercle + triangle
  const SymPump = ({x,y,r=22,label,sub,color='#1a1a2e',stb=false}) => (
    <g>
      <circle cx={x} cy={y} r={r} fill={stb?'#f8fafc':'#e8f4f8'} stroke={color} strokeWidth="2"/>
      <polygon points={`${x},${y-r+4} ${x+r-4},${y+r-6} ${x-r+4},${y+r-6}`} fill={color} opacity={stb?0.3:0.7}/>
      <text x={x} y={y+3} textAnchor="middle" fontSize="9" fontWeight="700" fill={stb?'#94a3b8':color}>{label}</text>
      {sub&&<text x={x} y={y+r+12} textAnchor="middle" fontSize="8" fill="#64748b">{sub}</text>}
    </g>
  );
  // Moteur électrique : M dans cercle
  const SymMotor = ({x,y,r=14,stb=false}) => (
    <g>
      <circle cx={x} cy={y} r={r} fill={stb?'#f1f5f9':'#1e3a8a'} stroke={stb?'#94a3b8':'#1e3a8a'} strokeWidth="1.5"/>
      <text x={x} y={y+4} textAnchor="middle" fontSize="11" fontWeight="800" fill={stb?'#94a3b8':'white'}>M</text>
    </g>
  );
  // Vanne à passage direct (deux triangles face à face)
  const SymVanne = ({x,y,h=14,stroke='#1a1a2e',horiz=true}) => horiz ? (
    <g>
      <polygon points={`${x-h},${y-h/2} ${x},${y} ${x-h},${y+h/2}`} fill="white" stroke={stroke} strokeWidth="1.5"/>
      <polygon points={`${x+h},${y-h/2} ${x},${y} ${x+h},${y+h/2}`} fill="white" stroke={stroke} strokeWidth="1.5"/>
      <line x1={x} y1={y-h} x2={x} y2={y-h*1.5} stroke={stroke} strokeWidth="1.2"/>
      <rect x={x-h/2} y={y-h*2} width={h} height={h*0.6} fill="white" stroke={stroke} strokeWidth="1.2"/>
    </g>
  ) : (
    <g>
      <polygon points={`${x-h/2},${y-h} ${x},${y} ${x+h/2},${y-h}`} fill="white" stroke={stroke} strokeWidth="1.5"/>
      <polygon points={`${x-h/2},${y+h} ${x},${y} ${x+h/2},${y+h}`} fill="white" stroke={stroke} strokeWidth="1.5"/>
      <line x1={x-h} y1={y} x2={x-h*1.5} y2={y} stroke={stroke} strokeWidth="1.2"/>
      <rect x={x-h*2} y={y-h/2} width={h*0.6} height={h} fill="white" stroke={stroke} strokeWidth="1.2"/>
    </g>
  );
  // Clapet anti-retour
  const SymClapet = ({x,y,h=12}) => (
    <g>
      <line x1={x-h} y1={y} x2={x+h} y2={y} stroke="#1a1a2e" strokeWidth="1.5"/>
      <polygon points={`${x-h/2},${y-h/1.5} ${x+h/2},${y} ${x-h/2},${y+h/1.5}`} fill="#1a1a2e" opacity="0.8"/>
      <line x1={x+h/2} y1={y-h} x2={x+h/2} y2={y+h} stroke="#1a1a2e" strokeWidth="2"/>
    </g>
  );
  // Manomètre
  const SymMano = ({x,y,r=8,label='P'}) => (
    <g>
      <circle cx={x} cy={y} r={r} fill="white" stroke="#1a1a2e" strokeWidth="1.2"/>
      <path d={`M${x-r*0.6},${y+r*0.2} A${r*0.7},${r*0.7} 0 0,1 ${x+r*0.6},${y+r*0.2}`} fill="none" stroke="#1a1a2e" strokeWidth="0.8"/>
      <line x1={x} y1={y} x2={x+r*0.5} y2={y-r*0.4} stroke="#ef4444" strokeWidth="1"/>
      <text x={x} y={y+r+10} textAnchor="middle" fontSize="7" fill="#1a1a2e" fontWeight="600">{label}</text>
    </g>
  );
  // Crépine
  const SymCrepine = ({x,y}) => (
    <g>
      {[-6,-3,0,3,6].map(i=><line key={i} x1={x+i} y1={y} x2={x+i} y2={y+12} stroke="#475569" strokeWidth="1.2"/>)}
      <rect x={x-8} y={y} width="16" height="12" fill="none" stroke="#475569" strokeWidth="1"/>
      <text x={x} y={y+22} textAnchor="middle" fontSize="7" fill="#475569">crépine</text>
    </g>
  );
  // Réservoir à vessie
  const SymVV = ({x,y}) => (
    <g>
      <ellipse cx={x} cy={y} rx="18" ry="24" fill="white" stroke="#1a1a2e" strokeWidth="1.5"/>
      <ellipse cx={x} cy={y+8} rx="10" ry="12" fill="#dbeafe" stroke="#2563eb" strokeWidth="1"/>
      <text x={x} y={y-30} textAnchor="middle" fontSize="8" fill="#1a1a2e" fontWeight="600">Réservoir</text>
      <text x={x} y={y-20} textAnchor="middle" fontSize="7" fill="#475569">à vessie</text>
    </g>
  );
  // Flotteur
  const SymFlotteur = ({x,y,label,color}) => (
    <g>
      <line x1={x} y1={y} x2={x} y2={y+20} stroke={color} strokeWidth="1.2"/>
      <circle cx={x} cy={y+28} r="8" fill={color} opacity="0.85"/>
      <text x={x+14} y={y+32} fontSize="7" fill={color} fontWeight="600">{label}</text>
    </g>
  );
  // Coffret
  const SymCoffret = ({x,y,w=90,h=60,title,sub,color='#1e1b4b'}) => (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={color} stroke="#4338ca" strokeWidth="1.5" rx="4"/>
      <rect x={x+4} y={y+4} width={w-8} height={h-8} fill="none" stroke="#6366f1" strokeWidth="0.8" rx="2"/>
      <text x={x+w/2} y={y+h/2-6} textAnchor="middle" fontSize="10" fontWeight="700" fill="white">{title}</text>
      {sub&&<text x={x+w/2} y={y+h/2+8} textAnchor="middle" fontSize="8" fill="#a5b4fc">{sub}</text>}
    </g>
  );
  // Pipe (tuyauterie)
  const Pipe = ({x1,y1,x2,y2,dashed=false,color='#1e293b',w=2}) => (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={w} strokeDasharray={dashed?'5 3':'none'} strokeLinecap="round"/>
  );
  // Flèche débit
  const Arrow = ({x1,y1,x2,y2,label,color='#2563eb'}) => (
    <g>
      <defs><marker id={`a${x1}${y1}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
        <path d="M1 1L9 5L1 9" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </marker></defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.5" markerEnd={`url(#a${x1}${y1})`}/>
      {label&&<text x={(x1+x2)/2} y={(y1+y2)/2-6} textAnchor="middle" fontSize="8" fill={color} fontWeight="600">{label}</text>}
    </g>
  );
  // Cote dimensionnelle
  const Cote = ({x1,y1,x2,y2,label,vert=true}) => {
    const mx=(x1+x2)/2, my=(y1+y2)/2;
    return <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ef4444" strokeWidth="1" markerEnd="url(#arrC)" markerStart="url(#arrC)"/>
      <text x={vert?x1-18:mx} y={vert?my:y1-8} textAnchor="middle" fontSize="8" fill="#ef4444" fontWeight="600" transform={vert?`rotate(-90,${x1-18},${my})`:'none'}>{label}</text>
    </g>;
  };

  // ── CARTOUCHE ──
  const Cartouche = ({Q,HMT}) => (
    <g>
      <rect x="0" y="500" width="900" height="70" fill="#1e293b"/>
      <line x1="0" y1="500" x2="900" y2="500" stroke="#14b8a6" strokeWidth="2.5"/>
      {[
        {x:10, title:'INSTALLATION', lines:[t.toUpperCase(), `${cfg.np} serv. + ${cfg.ns} sec.`, `${cfg.fluid} — ${cfg.temp}°C`]},
        {x:210,title:'HYDRAULIQUE',  lines:[`Q = ${Q} m³/h`, `HMT = ${HMT} m`, `Pa ≈ ${H.Pa} kW`]},
        {x:400,title:'TUYAUTERIES',  lines:[`DN Ref : ${t==='forage'?cfg.dn_f:t==='relevage'?cfg.dn_r:cfg.dn_ref} mm — ${t==='forage'?cfg.mat_f:cfg.mat_ref}`, t!=='forage'&&t!=='relevage'?`DN Asp : ${cfg.dn_asp} mm — ${cfg.mat_asp}`:''].filter(Boolean)},
        {x:590,title:'SPÉCIFICATIONS',lines:[cfg.volt, cfg.prot, `Acc : ${Object.values(acc).filter(Boolean).length} équip.`]},
        {x:760,title:'ECO-PUMP AFRIK',lines:[cfg.proj, cfg.date, 'ISO 14692 / EN 806']},
      ].map(col=>(
        <g key={col.x}>
          {col.x>10&&<line x1={col.x-10} y1="508" x2={col.x-10} y2="562" stroke="#334155" strokeWidth="0.8"/>}
          <text x={col.x} y="518" fontSize="9" fontWeight="700" fill="#14b8a6">{col.title}</text>
          {col.lines.map((l,i)=><text key={i} x={col.x} y={534+i*14} fontSize="9" fill={i===2&&col.x===210?'#22c55e':'white'} fontWeight={i===2&&col.x===210?700:400}>{l}</text>)}
        </g>
      ))}
      <text x="6" y="572" fontSize="7" fill="#475569">Conformité : ISO 14692, NF EN 806, DTU 60.11 | Expert Hydraulique IA v4.0 | {cfg.date}</text>
    </g>
  );

  // ══════════════════════════════════════════════════════════
  // SCHÉMA FORAGE — style technique normalisé
  // ══════════════════════════════════════════════════════════

  // ══════════════════════════════════════════════════════════
  // DEFS COMMUNES P&ID — symboles normalisés ISO 10628 / ISA 5.1
  // ══════════════════════════════════════════════════════════
  const PID_DEFS = () => (
    <defs>
      {/* Flèches */}
      <marker id="arr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto">
        <polygon points="0,0 8,4 0,8" fill="#1e293b"/>
      </marker>
      <marker id="arrB" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto">
        <polygon points="0,0 8,4 0,8" fill="#2563eb"/>
      </marker>
      <marker id="arrR" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="4" markerHeight="4" orient="auto">
        <polygon points="0,0 8,4 0,8" fill="#dc2626"/>
      </marker>
      <marker id="arrRev" viewBox="0 0 8 8" refX="1" refY="4" markerWidth="5" markerHeight="5" orient="auto">
        <polygon points="8,0 0,4 8,8" fill="#1e293b"/>
      </marker>
      {/* Hachures sol */}
      <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="8" stroke="#94a3b8" strokeWidth="1" opacity="0.5"/>
      </pattern>
      {/* Hachures béton */}
      <pattern id="beton" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="10" stroke="#64748b" strokeWidth="1.5" opacity="0.35"/>
        <line x1="5" y1="0" x2="5" y2="10" stroke="#64748b" strokeWidth="0.6" opacity="0.2"/>
      </pattern>
      {/* Eau */}
      <linearGradient id="eau" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.7"/>
        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.25"/>
      </linearGradient>
      {/* Terrain */}
      <pattern id="terrain" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="12" stroke="#92400e" strokeWidth="1" opacity="0.3"/>
      </pattern>
    </defs>
  );

  // ── Pompe centrifuge P&ID (cercle + triangle) ──
  const PIDPompe = ({cx,cy,r=14,label,stb=false,color='#1e293b'}) => {
    const c = stb ? '#94a3b8' : color;
    return <g>
      <circle cx={cx} cy={cy} r={r} fill="white" stroke={c} strokeWidth="1.5"/>
      <polygon points={`${cx},${cy-r+3} ${cx+r-3},${cy+r-3} ${cx-r+3},${cy+r-3}`} fill={c} opacity={stb?0.35:0.7}/>
      <text x={cx} y={cy+4} textAnchor="middle" fontSize="7" fontWeight="700" fill={stb?'#94a3b8':c}>{label}</text>
    </g>;
  };
  // ── Moteur P&ID ──
  const PIDMoteur = ({cx,cy,r=11,stb=false}) => {
    const c = stb ? '#94a3b8' : '#1e293b';
    return <g>
      <circle cx={cx} cy={cy} r={r} fill={stb?'#f1f5f9':'white'} stroke={c} strokeWidth="1.5"/>
      <text x={cx} y={cy+4} textAnchor="middle" fontSize="9" fontWeight="700" fill={c}>M</text>
    </g>;
  };
  // ── Vanne papillon / passage direct ──
  const PIDVanne = ({cx,cy,h=9,horiz=true,color='#1e293b'}) => horiz ? (
    <g>
      <polygon points={`${cx-h},${cy-h/2} ${cx},${cy} ${cx-h},${cy+h/2}`} fill="white" stroke={color} strokeWidth="1.2"/>
      <polygon points={`${cx+h},${cy-h/2} ${cx},${cy} ${cx+h},${cy+h/2}`} fill="white" stroke={color} strokeWidth="1.2"/>
      <line x1={cx} y1={cy-h} x2={cx} y2={cy-h*1.7} stroke={color} strokeWidth="1"/>
      <line x1={cx-h*0.6} y1={cy-h*1.7} x2={cx+h*0.6} y2={cy-h*1.7} stroke={color} strokeWidth="1.2"/>
    </g>
  ) : (
    <g>
      <polygon points={`${cx-h/2},${cy-h} ${cx},${cy} ${cx+h/2},${cy-h}`} fill="white" stroke={color} strokeWidth="1.2"/>
      <polygon points={`${cx-h/2},${cy+h} ${cx},${cy} ${cx+h/2},${cy+h}`} fill="white" stroke={color} strokeWidth="1.2"/>
      <line x1={cx-h} y1={cy} x2={cx-h*1.7} y2={cy} stroke={color} strokeWidth="1"/>
      <line x1={cx-h*1.7} y1={cy-h*0.6} x2={cx-h*1.7} y2={cy+h*0.6} stroke={color} strokeWidth="1.2"/>
    </g>
  );
  // ── Clapet anti-retour ──
  const PIDClapet = ({cx,cy,h=9,horiz=true}) => horiz ? (
    <g>
      <line x1={cx-h} y1={cy} x2={cx+h} y2={cy} stroke="#1e293b" strokeWidth="1.2"/>
      <polygon points={`${cx-h/2},${cy-h/1.5} ${cx+h/2},${cy} ${cx-h/2},${cy+h/1.5}`} fill="#1e293b" opacity="0.75"/>
      <line x1={cx+h/2} y1={cy-h} x2={cx+h/2} y2={cy+h} stroke="#1e293b" strokeWidth="1.8"/>
    </g>
  ) : (
    <g>
      <line x1={cx} y1={cy-h} x2={cx} y2={cy+h} stroke="#1e293b" strokeWidth="1.2"/>
      <polygon points={`${cx-h/1.5},${cy-h/2} ${cx},${cy+h/2} ${cx+h/1.5},${cy-h/2}`} fill="#1e293b" opacity="0.75"/>
      <line x1={cx-h} y1={cy-h/2} x2={cx+h} y2={cy-h/2} stroke="#1e293b" strokeWidth="1.8"/>
    </g>
  );
  // ── Manomètre (cercle avec aiguille) ──
  const PIDMano = ({cx,cy,r=9,label='PI'}) => (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="white" stroke="#1e293b" strokeWidth="1.2"/>
      <path d={`M${cx-r*0.65},${cy+r*0.2} A${r*0.7},${r*0.7} 0 0,1 ${cx+r*0.65},${cy+r*0.2}`} fill="none" stroke="#1e293b" strokeWidth="0.7"/>
      <line x1={cx} y1={cy} x2={cx+r*0.5} y2={cy-r*0.45} stroke="#dc2626" strokeWidth="1"/>
      <text x={cx} y={cy+r+9} textAnchor="middle" fontSize="7" fill="#1e293b" fontWeight="600">{label}</text>
    </g>
  );
  // ── Débitmètre ──
  const PIDDebit = ({cx,cy,label='FI'}) => (
    <g>
      <rect x={cx-12} y={cy-10} width="24" height="20" fill="white" stroke="#1e293b" strokeWidth="1.2"/>
      <text x={cx} y={cy+4} textAnchor="middle" fontSize="9" fontWeight="700" fill="#1e293b">{label}</text>
      <text x={cx} y={cy+20} textAnchor="middle" fontSize="6" fill="#64748b">FT</text>
    </g>
  );
  // ── Crépine ──
  const PIDCrepine = ({cx,cy,h=10}) => (
    <g>
      <rect x={cx-h/2} y={cy} width={h} height={h*0.8} fill="none" stroke="#64748b" strokeWidth="1.2"/>
      {[-3,0,3].map(i=><line key={i} x1={cx+i} y1={cy} x2={cx+i} y2={cy+h*0.8} stroke="#64748b" strokeWidth="0.8"/>)}
      <text x={cx} y={cy+h*0.8+9} textAnchor="middle" fontSize="6" fill="#64748b">STR</text>
    </g>
  );
  // ── Soupape sécurité ──
  const PIDSoupape = ({cx,cy}) => (
    <g>
      <polygon points={`${cx},${cy-9} ${cx+7},${cy+5} ${cx-7},${cy+5}`} fill="white" stroke="#dc2626" strokeWidth="1.2"/>
      <line x1={cx} y1={cy+5} x2={cx} y2={cy+14} stroke="#dc2626" strokeWidth="1.2"/>
      <line x1={cx-5} y1={cy+14} x2={cx+5} y2={cy+14} stroke="#dc2626" strokeWidth="1.5"/>
      <text x={cx} y={cy-13} textAnchor="middle" fontSize="6" fill="#dc2626" fontWeight="600">PSV</text>
    </g>
  );
  // ── Réservoir à vessie ──
  const PIDVessie = ({cx,cy}) => (
    <g>
      <ellipse cx={cx} cy={cy} rx={14} ry={20} fill="white" stroke="#1e293b" strokeWidth="1.2"/>
      <ellipse cx={cx} cy={cy+5} rx={8} ry={10} fill="#dbeafe" stroke="#2563eb" strokeWidth="0.8"/>
      <text x={cx} y={cy-24} textAnchor="middle" fontSize="6" fill="#1e293b" fontWeight="600">VBE</text>
      <text x={cx} y={cy+28} textAnchor="middle" fontSize="6" fill="#64748b">réservoir</text>
    </g>
  );
  // ── Tag instrument (cercle ISA) ──
  const PIDTag = ({cx,cy,tag,r=9}) => (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="white" stroke="#1e293b" strokeWidth="1"/>
      <text x={cx} y={cy+3} textAnchor="middle" fontSize="6.5" fill="#1e293b" fontWeight="700">{tag}</text>
    </g>
  );
  // ── Cartouche technique bas de page ──
  const CartouchePID = ({Q,HMT,titre,sousTitre}) => (
    <g>
      {/* Bande titre */}
      <rect x={0} y={530} width={1100} height={20} fill="#1e293b"/>
      <text x={550} y={544} textAnchor="middle" fontSize="9" fontWeight="700" fill="white" letterSpacing="0.5">{titre}</text>
      {/* Cartouche infos */}
      <rect x={0} y={550} width={1100} height={50} fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.5"/>
      {/* Colonnes */}
      {[220,440,660,880].map(x=><line key={x} x1={x} y1={550} x2={x} y2={600} stroke="#cbd5e1" strokeWidth="0.5"/>)}
      <text x={10} y={562} fontSize="7" fontWeight="700" fill="#64748b">PROJET</text>
      <text x={10} y={573} fontSize="8" fill="#1e293b">{sousTitre}</text>
      <text x={10} y={585} fontSize="7" fill="#64748b">ECO-PUMP AFRIK</text>
      <text x={230} y={562} fontSize="7" fontWeight="700" fill="#64748b">HYDRAULIQUE</text>
      <text x={230} y={573} fontSize="8" fill="#059669" fontWeight="700">HMT = {HMT} m</text>
      <text x={230} y={585} fontSize="8" fill="#7c3aed" fontWeight="700">Q = {Q} m³/h</text>
      <text x={450} y={562} fontSize="7" fontWeight="700" fill="#64748b">NORMES</text>
      <text x={450} y={573} fontSize="7" fill="#1e293b">ISO 10628 | ISA 5.1</text>
      <text x={450} y={585} fontSize="7" fill="#1e293b">EN 806 | NF DTU 60.11</text>
      <text x={670} y={562} fontSize="7" fontWeight="700" fill="#64748b">LÉGENDE</text>
      <line x1={670} y1={572} x2={690} y2={572} stroke="#1e293b" strokeWidth="2"/>
      <text x={695} y={575} fontSize="6.5" fill="#1e293b">Process</text>
      <line x1={670} y1={582} x2={690} y2={582} stroke="#1e293b" strokeWidth="1" strokeDasharray="4 2"/>
      <text x={695} y={585} fontSize="6.5" fill="#1e293b">Signal / câble</text>
      <text x={890} y={562} fontSize="7" fontWeight="700" fill="#64748b">DATE / VERSION</text>
      <text x={890} y={573} fontSize="7" fill="#1e293b">{new Date().toLocaleDateString('fr-FR')}</text>
      <text x={890} y={585} fontSize="8" fill="#0ea5e9" fontWeight="700">v4.0 PRO</text>
    </g>
  );

  // ══════════════════════════════════════════════════════════
  // SCHÉMA FORAGE — style P&ID technique
  // ══════════════════════════════════════════════════════════
  const SchemaForage = () => {
    const a=acc, c=cfg;
    // Layout horizontal : forage gauche, surface droite
    // Coordonnées : viewBox 1100×600
    const foX=160, foW=100; // forage colonne x et largeur
    const ndY=240; // niveau dynamique Y
    const pmpY=380; // pompe Y
    const surY=130; // ligne de surface (NGF 0)
    const pipeY=100; // tuyau principal horizontal
    const chateauX=820, chateauY=60, chateauH=90, chateauW=80;
    return (
    <svg width="100%" viewBox="0 0 1100 600" id="hydraulic-schema"
      style={{display:'block',background:'white',fontFamily:'Arial,sans-serif',border:'1px solid #e2e8f0'}}>
      <PID_DEFS/>

      {/* ── Titre bandeau ── */}
      <rect x={0} y={0} width={1100} height={28} fill="#1e293b"/>
      <text x={550} y={18} textAnchor="middle" fontSize="11" fontWeight="700" fill="white" letterSpacing="1">
        SCHÉMA DE PRINCIPE — POMPAGE EN FORAGE / PUITS
      </text>
      <text x={550} y={26} textAnchor="middle" fontSize="7" fill="#94a3b8">
        {c.proj} | {c.volt} | Q={c.Q_f} m³/h | HMT={H.HMT} m | DN{c.dn_f} {c.mat_f}
      </text>

      {/* ── Sol NGF 0 ── */}
      <line x1={0} y1={surY} x2={1100} y2={surY} stroke="#78716c" strokeWidth="1.5"/>
      <rect x={0} y={surY} width={1100} height={8} fill="url(#hatch)" opacity="0.6"/>
      <text x={8} y={surY-4} fontSize="7" fontWeight="700" fill="#78716c">NGF ± 0.00</text>

      {/* ── Terrain (coupe géologique) ── */}
      <rect x={foX-60} y={surY+8} width={220} height={pmpY+80-surY} fill="url(#terrain)" opacity="0.25"/>
      <text x={foX+30} y={surY+22} fontSize="7" fill="#92400e" opacity="0.7">terrain naturel</text>

      {/* ── Tubage forage ── */}
      <line x1={foX} y1={surY} x2={foX} y2={pmpY+60} stroke="#1d4ed8" strokeWidth="1.5" strokeDasharray="6 3"/>
      <line x1={foX+foW} y1={surY} x2={foX+foW} y2={pmpY+60} stroke="#1d4ed8" strokeWidth="1.5" strokeDasharray="6 3"/>
      <text x={foX+foW/2} y={surY-8} textAnchor="middle" fontSize="8" fontWeight="700" fill="#1d4ed8">
        FORAGE Ø{parseInt(c.dn_f)+60}mm
      </text>

      {/* ── Eau souterraine dans forage ── */}
      <rect x={foX+2} y={ndY} width={foW-4} height={pmpY+55-ndY} fill="url(#eau)"/>
      {[0,1,2].map(i=><line key={i} x1={foX+10+i*22} y1={ndY+6} x2={foX+24+i*22} y2={ndY+6}
        stroke="white" strokeWidth="1" opacity="0.8"/>)}

      {/* ── Niveau dynamique ── */}
      <line x1={foX-20} y1={ndY} x2={foX+foW+60} y2={ndY} stroke="#2563eb" strokeWidth="1" strokeDasharray="5 3"/>
      <text x={foX+foW+65} y={ndY+4} fontSize="7" fill="#2563eb">ND</text>

      {/* ── Cote Nd ── */}
      <line x1={foX-30} y1={surY} x2={foX-30} y2={ndY}
        stroke="#dc2626" strokeWidth="0.8" markerStart="url(#arrR)" markerEnd="url(#arrR)"/>
      <text x={foX-44} y={(surY+ndY)/2+3} textAnchor="middle" fontSize="7" fill="#dc2626" fontWeight="700"
        transform={`rotate(-90,${foX-44},${(surY+ndY)/2})`}>Nd={c.nd}m</text>

      {/* ── Colonne montante (tuyau dans forage) ── */}
      <rect x={foX+foW/2-5} y={surY+5} width={10} height={pmpY-24-surY} fill="#334155"/>

      {/* ── DN label colonne ── */}
      <text x={foX+foW+10} y={(surY+pmpY)/2} fontSize="7" fill="#475569">
        DN{c.dn_f}
      </text>
      <text x={foX+foW+10} y={(surY+pmpY)/2+10} fontSize="7" fill="#475569">
        {c.mat_f}
      </text>

      {/* ── Pompe immergée P&ID ── */}
      <PIDPompe cx={foX+foW/2} cy={pmpY} r={16} label="P1" color="#1e40af"/>
      {/* Moteur submersible en dessous */}
      <line x1={foX+foW/2} y1={pmpY+16} x2={foX+foW/2} y2={pmpY+30} stroke="#1e293b" strokeWidth="1"/>
      <PIDMoteur cx={foX+foW/2} cy={pmpY+42} r={12}/>
      <text x={foX+foW/2} y={pmpY+60} textAnchor="middle" fontSize="7" fill="#1e293b" fontWeight="600">
        ELECTROPOMPE
      </text>
      <text x={foX+foW/2} y={pmpY+70} textAnchor="middle" fontSize="7" fill="#64748b">{c.volt}</text>

      {/* ── Crépine ── */}
      {a.crepine&&<>
        <line x1={foX+foW/2} y1={pmpY+54} x2={foX+foW/2} y2={pmpY+63} stroke="#1e293b" strokeWidth="1"/>
        <PIDCrepine cx={foX+foW/2} cy={pmpY+63} h={12}/>
      </>}

      {/* ── Câble électrique ── */}
      <path d={`M${foX+foW/2+16} ${pmpY+30} Q${foX+foW+25} ${pmpY} ${foX+foW+30} ${surY+20}`}
        fill="none" stroke="#f59e0b" strokeWidth="0.9" strokeDasharray="4 2"/>
      <text x={foX+foW+52} y={surY+50} fontSize="7" fill="#d97706">câble élec.</text>
      <text x={foX+foW+52} y={surY+60} fontSize="7" fill="#d97706">{c.prot}</text>

      {/* ── Tuyauterie surface (horizontal) ── */}
      {/* Montée forage → pipeY */}
      <line x1={foX+foW/2} y1={surY+5} x2={foX+foW/2} y2={pipeY}
        stroke="#1e293b" strokeWidth="2.5"/>
      {/* Horizontal vers château */}
      <line x1={foX+foW/2} y1={pipeY} x2={chateauX} y2={pipeY}
        stroke="#1e293b" strokeWidth="2.5"/>
      {/* Label conduite principale */}
      <text x={(foX+foW/2+chateauX)/2} y={pipeY-6} textAnchor="middle" fontSize="7.5" fill="#1e293b" fontWeight="600">
        DN{c.dn_f} — {c.mat_f}
      </text>

      {/* ── Clapet anti-retour ── */}
      {a.clapet&&<>
        <PIDClapet cx={foX+foW/2+80} cy={pipeY} h={10} horiz={true}/>
        <text x={foX+foW/2+80} y={pipeY-14} textAnchor="middle" fontSize="7" fill="#475569">CAR</text>
      </>}

      {/* ── Vanne isolement ── */}
      {a.v_ref&&<>
        <PIDVanne cx={foX+foW/2+160} cy={pipeY} h={10} horiz={true}/>
        <text x={foX+foW/2+160} y={pipeY-18} textAnchor="middle" fontSize="7" fill="#1e293b">VIA</text>
      </>}

      {/* ── Manomètre ── */}
      {a.mano_ref&&<>
        <line x1={foX+foW/2+240} y1={pipeY} x2={foX+foW/2+240} y2={pipeY-22} stroke="#1e293b" strokeWidth="0.8"/>
        <PIDMano cx={foX+foW/2+240} cy={pipeY-31}/>
      </>}

      {/* ── Débitmètre ── */}
      {a.debit&&<>
        <PIDDebit cx={foX+foW/2+320} cy={pipeY}/>
        <text x={foX+foW/2+320} y={pipeY-16} textAnchor="middle" fontSize="7" fill="#475569">FT-01</text>
      </>}

      {/* ── Coffret électrique ── */}
      {a.coffret&&<>
        <rect x={foX+foW/2+180} y={surY+20} width={90} height={56} fill="#f0f4ff" stroke="#4338ca" strokeWidth="1.2"/>
        <rect x={foX+foW/2+184} y={surY+24} width={82} height={48} fill="none" stroke="#6366f1" strokeWidth="0.6" strokeDasharray="3 2"/>
        <text x={foX+foW/2+225} y={surY+44} textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#3730a3">COFFRET</text>
        <text x={foX+foW/2+225} y={surY+55} textAnchor="middle" fontSize="6.5" fill="#4f46e5">COMMANDE</text>
        <text x={foX+foW/2+225} y={surY+66} textAnchor="middle" fontSize="6" fill="#6366f1">{c.volt}</text>
        {/* Câble coffret → coffret électrique */}
        <line x1={foX+foW/2+225} y1={surY+76} x2={foX+foW/2+225} y2={pipeY-5}
          stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="3 2"/>
      </>}

      {/* ── Château d'eau ── */}
      {/* Montée vers château */}
      <line x1={chateauX} y1={pipeY} x2={chateauX} y2={chateauY+chateauH} stroke="#1e293b" strokeWidth="2.5"/>
      {/* Corps château */}
      <rect x={chateauX-chateauW/2+10} y={chateauY} width={chateauW-20} height={10} fill="#dbeafe" stroke="#1d4ed8" strokeWidth="1.2"/>
      <rect x={chateauX-chateauW/2+16} y={chateauY+10} width={chateauW-32} height={chateauH} fill="#dbeafe" stroke="#1d4ed8" strokeWidth="1.2"/>
      {/* Niveau eau château */}
      <line x1={chateauX-chateauW/2+18} y1={chateauY+30} x2={chateauX+chateauW/2-18} y2={chateauY+30}
        stroke="#2563eb" strokeWidth="1" strokeDasharray="4 2"/>
      {/* Reflets */}
      {[0,1].map(i=><line key={i} x1={chateauX-14+i*14} y1={chateauY+35} x2={chateauX-6+i*14} y2={chateauY+35}
        stroke="white" strokeWidth="1" opacity="0.7"/>)}
      <text x={chateauX} y={chateauY-6} textAnchor="middle" fontSize="8" fontWeight="700" fill="#1d4ed8">
        CHÂTEAU D'EAU
      </text>
      <text x={chateauX} y={chateauY+chateauH+16} textAnchor="middle" fontSize="7" fill="#1d4ed8">
        H={c.hch}m
      </text>
      {/* Cote château */}
      <line x1={chateauX+chateauW/2} y1={surY} x2={chateauX+chateauW/2} y2={chateauY}
        stroke="#dc2626" strokeWidth="0.8" markerStart="url(#arrR)" markerEnd="url(#arrR)"/>
      <text x={chateauX+chateauW/2+14} y={(surY+chateauY)/2+3} fontSize="7" fill="#dc2626" fontWeight="700">
        Hch={c.hch}m
      </text>
      {/* Flèche Q vers château */}
      <text x={(foX+foW/2+chateauX)/2} y={pipeY+14} textAnchor="middle" fontSize="8" fill="#059669" fontWeight="700">
        → Q={c.Q_f} m³/h
      </text>

      {/* ── Bilan hydraulique ── */}
      <rect x={680} y={surY+20} width={185} height={140} fill="#f8fafc" stroke="#1e293b" strokeWidth="1.2"/>
      <rect x={680} y={surY+20} width={185} height={20} fill="#1e293b"/>
      <text x={772} y={surY+34} textAnchor="middle" fontSize="8" fontWeight="700" fill="white">BILAN HYDRAULIQUE</text>
      {[
        {l:`Q = ${c.Q_f} m³/h`, c:'#1e293b', b:false},
        {l:`Nd = ${c.nd} m | Hch = ${c.hch} m`, c:'#1e293b', b:false},
        {l:`Hgéo = ${H.Hg} m`, c:'#1e293b', b:false},
        {l:`J.ref = ${H.Jr} m`, c:'#1e293b', b:false},
        {l:`HMT = ${H.HMT} m`, c:'#059669', b:true},
        {l:`Pa ≈ ${H.Pa} kW`, c:'#7c3aed', b:true},
        {l:`V = ${H.V} m/s | DN${c.dn_f}`, c:'#1e293b', b:false},
      ].map((r,i)=>(
        <text key={i} x={688} y={surY+55+i*14} fontSize="8" fill={r.c} fontWeight={r.b?700:400}>{r.l}</text>
      ))}

      {CartouchePID({Q:c.Q_f, HMT:H.HMT, titre:'SCHÉMA DE PRINCIPE — FORAGE / PUITS', sousTitre:c.proj})}
    </svg>);
  };

  // ══════════════════════════════════════════════════════════
  // SCHÉMA RELEVAGE — style P&ID technique
  // ══════════════════════════════════════════════════════════
  const SchemaRelevage = () => {
    const a=acc, c=cfg;
    const np=c.np, ns=c.ns, tot=np+ns;

    // ── Layout général ──
    // COFFRET à gauche | BÂCHE avec pompes immergées | COLLECTEUR | RÉSEAU
    const surY=470;       // NGF sol
    const cofX=20, cofY=80, cofW=100, cofH=tot<=2?80:95; // coffret gauche
    const bachX=140, bachY=160, bachW=tot<=2?180:tot===3?220:260, bachH=290;
    const waterY=bachY+55;  // NHE
    const nbeY=bachY+bachH-70; // NBE
    // Pompes au fond de la bâche
    const pSp=tot<=2?80:tot===3?65:55;
    const pX0=bachX+bachW/(tot+1); // centrage pompes dans bâche
    const pumpBotY=bachY+bachH-30; // bas pompe (moteur)
    const pumpTopY=pumpBotY-50;    // haut pompe (sortie)
    // Colonne montante de chaque pompe → sort par le haut de la bâche
    const colTopY=bachY-2; // sortie colonne au-dessus bâche
    const colHorizY=bachY-30; // horizontal collecteur
    const outX=bachX+bachW; // sortie droite du collecteur
    // Bus câbles électriques (chemin câbles horizontal sous coffret)
    const cableBusY=cofY+cofH+12; // Y du bus câble horizontal
    const cableBusX1=cofX+cofW;   // depuis coffret
    const cableBusX2=bachX+bachW-10; // jusqu'au bord droit bâche

    return (
    <svg width="100%" viewBox="0 0 1100 600" id="hydraulic-schema"
      style={{display:'block',background:'white',fontFamily:'Arial,sans-serif',border:'1px solid #e2e8f0'}}>
      <PID_DEFS/>

      {/* ── Titre ── */}
      <rect x={0} y={0} width={1100} height={28} fill="#1e293b"/>
      <text x={550} y={18} textAnchor="middle" fontSize="11" fontWeight="700" fill="white" letterSpacing="1">
        SCHÉMA DE PRINCIPE — STATION DE RELEVAGE
      </text>
      <text x={550} y={26} textAnchor="middle" fontSize="7" fill="#94a3b8">
        {c.proj} | {c.volt} | Q={c.Q_r} m³/h | HMT={H.HMT} m | {tot} pompe{tot>1?'s':''} ({np} serv.+{ns} sec.)
      </text>

      {/* ── Sol ── */}
      <line x1={0} y1={surY} x2={1100} y2={surY} stroke="#78716c" strokeWidth="1.2"/>
      <rect x={0} y={surY} width={1100} height={8} fill="url(#hatch)" opacity="0.5"/>
      <text x={8} y={surY-4} fontSize="7" fontWeight="700" fill="#78716c">NGF ± 0.00</text>

      {/* ══════════════════════════════════
           COFFRET — gauche de la bâche
         ══════════════════════════════════ */}
      {a.coffret&&<>
        <rect x={cofX} y={cofY} width={cofW} height={cofH} fill="#f0f4ff" stroke="#4338ca" strokeWidth="1.2"/>
        <rect x={cofX+3} y={cofY+3} width={cofW-6} height={cofH-6} fill="none" stroke="#6366f1" strokeWidth="0.6" strokeDasharray="3 2"/>
        <text x={cofX+cofW/2} y={cofY+18} textAnchor="middle" fontSize="8" fontWeight="700" fill="#3730a3">COFFRET</text>
        <text x={cofX+cofW/2} y={cofY+30} textAnchor="middle" fontSize="7" fill="#4f46e5">COMMANDE</text>
        <text x={cofX+cofW/2} y={cofY+42} textAnchor="middle" fontSize="6.5" fill="#6366f1">{c.volt}</text>
        <text x={cofX+cofW/2} y={cofY+53} textAnchor="middle" fontSize="6.5" fill="#6366f1">{c.prot}</text>
        {tot>2&&<text x={cofX+cofW/2} y={cofY+65} textAnchor="middle" fontSize="6" fill="#4f46e5">{tot} départs</text>}

        {/* ── Bus câble horizontal coffret → bâche (ORTHOGONAL) ── */}
        {/* Ligne horizontale principale bus câble */}
        <line x1={cableBusX1} y1={cableBusY} x2={cableBusX2} y2={cableBusY}
          stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="5 2"/>
        <text x={(cableBusX1+cableBusX2)/2} y={cableBusY-5} textAnchor="middle" fontSize="6.5" fill="#d97706">
          bus câbles alimentation
        </text>

        {/* Un départ vertical par pompe depuis le bus */}
        {[...Array(tot)].map((_,i)=>{
          const px=pX0+i*pSp;
          return <g key={i}>
            {/* Vertical du bus vers la pompe */}
            <line x1={px} y1={cableBusY} x2={px} y2={pumpBotY-10}
              stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="4 2" opacity="0.85"/>
            {/* Piquage horizontal sur bus */}
            <circle cx={px} cy={cableBusY} r={2.5} fill="#f59e0b"/>
          </g>;
        })}

        {/* Câbles flotteurs — chemin orthogonal : coffret → vertical → horizontal dans bâche */}
        {a.fl_h&&<>
          {/* Vertical depuis coffret bas → niveau NHE */}
          <line x1={cofX+cofW-15} y1={cofY+cofH} x2={cofX+cofW-15} y2={waterY}
            stroke="#059669" strokeWidth="0.7" strokeDasharray="3 2" opacity="0.8"/>
          {/* Horizontal vers flotteur NHE */}
          <line x1={cofX+cofW-15} y1={waterY} x2={bachX+35} y2={waterY}
            stroke="#059669" strokeWidth="0.7" strokeDasharray="3 2" opacity="0.8"/>
        </>}
        {a.fl_b&&<>
          {/* Vertical depuis coffret bas → niveau NBE */}
          <line x1={cofX+cofW-25} y1={cofY+cofH} x2={cofX+cofW-25} y2={nbeY}
            stroke="#7c3aed" strokeWidth="0.7" strokeDasharray="3 2" opacity="0.8"/>
          {/* Horizontal vers flotteur NBE */}
          <line x1={cofX+cofW-25} y1={nbeY} x2={bachX+55} y2={nbeY}
            stroke="#7c3aed" strokeWidth="0.7" strokeDasharray="3 2" opacity="0.8"/>
        </>}

        {/* Légende */}
        <text x={cofX} y={cofY+cofH+30} fontSize="6.5" fill="#f59e0b">━ alim. pompes</text>
        {a.fl_h&&<text x={cofX} y={cofY+cofH+42} fontSize="6.5" fill="#059669">━ flotteur NHE</text>}
        {a.fl_b&&<text x={cofX} y={cofY+cofH+54} fontSize="6.5" fill="#7c3aed">━ flotteur NBE</text>}
      </>}

      {/* ══════════════════════════════════
           BÂCHE DE RELEVAGE
         ══════════════════════════════════ */}
      {/* Parois béton */}
      <rect x={bachX} y={bachY} width={bachW} height={bachH} fill="url(#beton)" opacity="0.4" stroke="#475569" strokeWidth="2"/>
      <rect x={bachX+5} y={bachY+5} width={bachW-10} height={bachH-10} fill="white" stroke="none"/>
      {/* Eau */}
      <rect x={bachX+5} y={waterY} width={bachW-10} height={bachY+bachH-waterY-5} fill="url(#eau)"/>
      {[0,1,2].map(i=><line key={i} x1={bachX+15+i*45} y1={waterY+7} x2={bachX+32+i*45} y2={waterY+7}
        stroke="white" strokeWidth="1" opacity="0.7"/>)}
      <text x={bachX+bachW/2} y={bachY-8} textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#475569">
        BÂCHE DE RELEVAGE
      </text>

      {/* NHE */}
      <line x1={bachX} y1={waterY} x2={bachX+bachW} y2={waterY} stroke="#2563eb" strokeWidth="0.8" strokeDasharray="5 2"/>
      <text x={bachX+bachW+5} y={waterY+4} fontSize="7" fill="#2563eb">NHE</text>
      {/* NBE */}
      <line x1={bachX} y1={nbeY} x2={bachX+bachW} y2={nbeY} stroke="#7c3aed" strokeWidth="0.8" strokeDasharray="3 2"/>
      <text x={bachX+bachW+5} y={nbeY+4} fontSize="7" fill="#7c3aed">NBE</text>

      {/* Flotteurs dans la bâche */}
      {a.fl_h&&<>
        <line x1={bachX+35} y1={waterY} x2={bachX+35} y2={waterY+18} stroke="#059669" strokeWidth="0.8"/>
        <circle cx={bachX+35} cy={waterY+25} r={7} fill="white" stroke="#059669" strokeWidth="1.2"/>
        <text x={bachX+35} y={waterY+29} textAnchor="middle" fontSize="5.5" fill="#059669" fontWeight="700">NH</text>
      </>}
      {a.fl_b&&<>
        <line x1={bachX+55} y1={nbeY} x2={bachX+55} y2={nbeY+18} stroke="#7c3aed" strokeWidth="0.8"/>
        <circle cx={bachX+55} cy={nbeY+25} r={7} fill="white" stroke="#7c3aed" strokeWidth="1.2"/>
        <text x={bachX+55} y={nbeY+29} textAnchor="middle" fontSize="5.5" fill="#7c3aed" fontWeight="700">NB</text>
      </>}

      {/* ══════════════════════════════════
           POMPES IMMERGÉES dans la bâche
         ══════════════════════════════════ */}
      {[...Array(tot)].map((_,i)=>{
        const px=pX0+i*pSp;
        const stb=i>=np;
        const pc=stb?'#94a3b8':'#1e293b';
        const pCY=pumpTopY+16; // centre pompe
        const mCY=pumpBotY-10; // centre moteur
        return <g key={i}>
          {/* ── Colonne montante (refoulement vertical) ── */}
          <line x1={px} y1={pCY-16} x2={px} y2={colTopY} stroke={pc} strokeWidth="2"/>

          {/* Clapet anti-retour sur colonne montante */}
          {a.clapet&&<>
            <PIDClapet cx={px} cy={bachY+65} h={9} horiz={false}/>
            <text x={px+13} y={bachY+68} fontSize="6.5" fill="#475569">CAR</text>
          </>}
          {/* Vanne de refoulement */}
          {a.v_ref&&<>
            <PIDVanne cx={px} cy={bachY+95} h={9} horiz={false}/>
            <text x={px+13} y={bachY+98} fontSize="6.5" fill="#1e293b">VIR</text>
          </>}

          {/* ── Pompe P&ID (centrifuge immergée) ── */}
          <PIDPompe cx={px} cy={pCY} r={16} label={stb?`P${i+1}S`:`P${i+1}`} stb={stb} color="#1e293b"/>

          {/* Axe pompe-moteur */}
          <line x1={px} y1={pCY+16} x2={px} y2={mCY-11} stroke={pc} strokeWidth="1"/>
          {/* Moteur submersible */}
          <PIDMoteur cx={px} cy={mCY} r={12} stb={stb}/>
          <text x={px} y={mCY+16} textAnchor="middle" fontSize="6" fill={pc} fontWeight={stb?400:600}>
            {stb?'SEC.':'SERV.'}
          </text>
          <text x={px} y={mCY+26} textAnchor="middle" fontSize="6" fill="#64748b">
            ≈{(parseFloat(H.Pa||0)/Math.max(np,1)).toFixed(1)}kW
          </text>

          {/* Manomètre refoulement (piqûre horizontale sur colonne) */}
          {a.mano_ref&&<>
            <line x1={px+16} y1={bachY+48} x2={px+28} y2={bachY+48} stroke="#1e293b" strokeWidth="0.8"/>
            <PIDMano cx={px+37} cy={bachY+48} r={8}/>
          </>}

          {/* Crépine en bas du moteur */}
          {a.crepine&&<>
            <line x1={px} y1={mCY+12} x2={px} y2={mCY+20} stroke={pc} strokeWidth="1"/>
            <PIDCrepine cx={px} cy={mCY+20} h={10}/>
          </>}
        </g>;
      })}

      {/* ══════════════════════════════════
           COLLECTEUR horizontal hors bâche
         ══════════════════════════════════ */}
      {/* Tuyaux individuels → collecteur (sorties colonnes montantes → horiz.) */}
      {[...Array(tot)].map((_,i)=>{
        const px=pX0+i*pSp;
        const stb=i>=np;
        return <line key={i} x1={px} y1={colTopY} x2={px} y2={colHorizY}
          stroke={stb?'#94a3b8':'#1e293b'} strokeWidth="2"/>;
      })}
      {/* Collecteur horizontal */}
      <line x1={pX0} y1={colHorizY} x2={outX+5} y2={colHorizY} stroke="#1e293b" strokeWidth="3"/>
      <text x={(pX0+outX)/2} y={colHorizY-8} textAnchor="middle" fontSize="7.5" fill="#1e293b" fontWeight="600">
        COLLECTEUR REF. DN{c.dn_r} — {c.mat_ref||'Acier'}
      </text>

      {/* ══════════════════════════════════
           LIGNE RÉSEAU → droite
         ══════════════════════════════════ */}
      <line x1={outX+5} y1={colHorizY} x2={840} y2={colHorizY} stroke="#1e293b" strokeWidth="2.5"/>
      <text x={(outX+5+840)/2} y={colHorizY+14} textAnchor="middle" fontSize="7" fill="#475569">
        DN{c.dn_r} — {c.mat_ref||'Acier'}
      </text>
      {/* Débitmètre */}
      {a.debit&&<>
        <PIDDebit cx={outX+80} cy={colHorizY}/>
        <text x={outX+80} y={colHorizY-16} textAnchor="middle" fontSize="7" fill="#475569">FT-01</text>
      </>}
      {/* Vanne de tête si pompe unique */}
      {a.v_ref&&tot===1&&<>
        <PIDVanne cx={outX+130} cy={colHorizY} h={9} horiz={true}/>
        <text x={outX+130} y={colHorizY+22} textAnchor="middle" fontSize="7" fill="#1e293b">VIR</text>
      </>}
      {/* Flèche + label réseau */}
      <line x1={840} y1={colHorizY} x2={862} y2={colHorizY} stroke="#1e293b" strokeWidth="2.5" markerEnd="url(#arr)"/>
      <text x={872} y={colHorizY+4} fontSize="9" fontWeight="700" fill="#059669">→ RÉSEAU</text>
      <text x={872} y={colHorizY+16} fontSize="7" fill="#64748b">Q={c.Q_r}m³/h</text>
      <text x={872} y={colHorizY+27} fontSize="7" fill="#64748b">HMT={H.HMT}m</text>

      {/* ── Bilan hydraulique ── */}
      <rect x={860} y={170} width={220} height={145} fill="#f8fafc" stroke="#1e293b" strokeWidth="1.2"/>
      <rect x={860} y={170} width={220} height={20} fill="#1e293b"/>
      <text x={970} y={184} textAnchor="middle" fontSize="8" fontWeight="700" fill="white">BILAN HYDRAULIQUE</text>
      {[
        {l:`Q unitaire = ${c.Q_r} m³/h`, c:'#1e293b'},
        {l:`H.ref = ${c.h_r} m`, c:'#1e293b'},
        {l:`J.ref = ${H.Jr} m`, c:'#1e293b'},
        {l:`HMT = ${H.HMT} m`, c:'#059669', b:true},
        {l:`Pa ≈ ${H.Pa} kW / pompe`, c:'#7c3aed', b:true},
        {l:`V = ${H.V} m/s | DN${c.dn_r}`, c:'#1e293b'},
        {l:`${tot} pompes (${np} serv. + ${ns} sec.)`, c:'#2563eb'},
      ].map((r,i)=>(
        <text key={i} x={868} y={200+i*16} fontSize="8" fill={r.c} fontWeight={r.b?700:400}>{r.l}</text>
      ))}

      {CartouchePID({Q:c.Q_r, HMT:H.HMT, titre:'SCHÉMA DE PRINCIPE — STATION DE RELEVAGE', sousTitre:c.proj})}
    </svg>);
  };

  // ══════════════════════════════════════════════════════════
  // SCHÉMA SURFACE / SURPRESSION / INCENDIE — style P&ID
  // ══════════════════════════════════════════════════════════

  // ══════════════════════════════════════════════════════════
  // SCHÉMA SURFACE / SURPRESSION / INCENDIE — P&ID propre
  // Layout : COFFRET (gauche) | SOURCE | ASPIRATION | POMPES | COLLECTEUR | RÉSEAU
  // ══════════════════════════════════════════════════════════

  // ══════════════════════════════════════════════════════════
  // SCHÉMA SURFACE / SURPRESSION / INCENDIE — P&ID v3
  // 3 configs aspiration : en charge (flooded) | niveau égal (level) | en dépression (suction_lift)
  // Bâche compacte, tuyauteries avec DN + longueurs, coffret gauche, câbles orthogonaux
  // ══════════════════════════════════════════════════════════
  const SchemaSurface = () => {
    const a=acc, c=cfg;
    const np=c.np, ns=c.ns, tot=np+ns;
    const isC=c.asp==='flooded';   // en charge
    const isL=c.asp==='level';     // niveau égal
    const isD=c.asp==='suction_lift'; // en dépression (aspiration)
    const tc=t==='incendie'?'#dc2626':t==='surpression'?'#6d28d9':'#1e293b';
    const titre=t==='incendie'?'INSTALLATION INCENDIE — EN 12845 / NFS 61-213'
      :t==='surpression'?'GROUPE DE SURPRESSION — EAU DOMESTIQUE'
      :'STATION DE POMPAGE EN SURFACE';

    // ── Layout général ──
    // viewBox 1100×600
    // Coffret : haut gauche
    // Bâche compacte : milieu gauche (petite)
    // Tuyau aspiration → pompes → collecteur → réseau
    //
    // Y de référence horizontal selon config :
    //   EN CHARGE    : pompe sous le niveau d'eau → tuyau aspiration descend de la bâche vers la pompe
    //   NIVEAU ÉGAL  : tuyau aspiration horizontal au même niveau
    //   EN DÉPRESSION: pompe au-dessus de la bâche → tuyau aspiration monte vers la pompe
    const surY=490;       // sol NGF
    const cofX=18, cofY=55, cofW=100, cofH=82;

    // Bâche compacte (petite représentation symbolique)
    const bachX=140, bachW=105, bachH=130;
    // Y bâche selon config aspiration
    const bachY=isC?220:isL?280:330; // en charge=haute, niveau=milieu, dépression=basse

    const waterY=bachY+35; // niveau eau NHE

    // Pompes
    const pSp=tot<=2?100:tot===3?86:74;
    const pX0=320;      // X 1ère pompe
    const lastPX=pX0+(tot-1)*pSp;

    // Y de la pompe selon config
    const pCY=isC?350:isL?310:270; // en charge=basse (pompe sous eau), dépression=haute

    // Collecteur refoulement (toujours en haut)
    const colY=140;
    // Moteur au-dessus de la pompe
    const mCY=pCY-46;

    // Ligne aspiration horizontale
    const aspLineY=isC?pCY+16:isL?pCY+16:pCY+16; // sortie bâche côté aspiration

    // Bus câble horizontal
    const busY=cofY+cofH+18;

    return (
    <svg width="100%" viewBox="0 0 1100 600" id="hydraulic-schema"
      style={{display:'block',background:'white',fontFamily:'Arial,sans-serif',border:'1px solid #e2e8f0'}}>
      <PID_DEFS/>

      {/* ── Titre ── */}
      <rect x={0} y={0} width={1100} height={28} fill="#1e293b"/>
      <text x={550} y={18} textAnchor="middle" fontSize="11" fontWeight="700" fill="white" letterSpacing="1">
        SCHÉMA DE PRINCIPE — {titre}
      </text>
      <text x={550} y={26} textAnchor="middle" fontSize="7" fill="#94a3b8">
        {c.proj} | {c.volt} | Q={c.Q} m³/h | HMT={H.HMT} m | Pa≈{H.Pa} kW | {tot} pompe{tot>1?'s':''}
      </text>

      {/* ── Sol NGF ── */}
      <line x1={0} y1={surY} x2={1100} y2={surY} stroke="#78716c" strokeWidth="1.2"/>
      <rect x={0} y={surY} width={1100} height={8} fill="url(#hatch)" opacity="0.5"/>
      <text x={8} y={surY-4} fontSize="7" fontWeight="700" fill="#78716c">NGF ± 0.00</text>

      {/* ══════════════════════════════════
           COFFRET — haut gauche
         ══════════════════════════════════ */}
      {a.coffret&&<>
        <rect x={cofX} y={cofY} width={cofW} height={cofH} fill="#f0f4ff" stroke="#4338ca" strokeWidth="1.2"/>
        <rect x={cofX+3} y={cofY+3} width={cofW-6} height={cofH-6} fill="none" stroke="#6366f1" strokeWidth="0.6" strokeDasharray="3 2"/>
        <text x={cofX+cofW/2} y={cofY+18} textAnchor="middle" fontSize="8" fontWeight="700" fill="#3730a3">COFFRET</text>
        <text x={cofX+cofW/2} y={cofY+30} textAnchor="middle" fontSize="7" fill="#4f46e5">COMMANDE</text>
        <text x={cofX+cofW/2} y={cofY+43} textAnchor="middle" fontSize="6.5" fill="#6366f1">{c.volt}</text>
        <text x={cofX+cofW/2} y={cofY+55} textAnchor="middle" fontSize="6.5" fill="#6366f1">{c.prot}</text>
        {a.vfd&&<text x={cofX+cofW/2} y={cofY+68} textAnchor="middle" fontSize="6" fill="#7c3aed" fontWeight="700">+ VFD</text>}

        {/* Bus câble horizontal orthogonal */}
        <line x1={cofX+cofW} y1={busY} x2={lastPX+20} y2={busY}
          stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="6 2"/>
        <text x={(cofX+cofW+lastPX+20)/2} y={busY-5} textAnchor="middle" fontSize="6.5" fill="#d97706">
          bus câbles alimentation
        </text>
        {/* Verticals par pompe depuis bus */}
        {[...Array(tot)].map((_,i)=>{
          const px=pX0+i*pSp;
          return <g key={i}>
            <line x1={px} y1={busY} x2={px} y2={mCY+11}
              stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="4 2" opacity="0.9"/>
            <circle cx={px} cy={busY} r={2.2} fill="#f59e0b"/>
          </g>;
        })}
        <text x={cofX} y={busY+18} fontSize="6.5" fill="#f59e0b">━ alim. pompes</text>
      </>}

      {/* ══════════════════════════════════
           BÂCHE / RÉSERVOIR COMPACT
           Représentation symbolique petite
         ══════════════════════════════════ */}
      {/* Parois */}
      <rect x={bachX} y={bachY} width={bachW} height={bachH}
        fill="url(#beton)" opacity="0.3" stroke="#475569" strokeWidth="1.5"/>
      <rect x={bachX+4} y={bachY+4} width={bachW-8} height={bachH-8} fill="white" stroke="none"/>
      {/* Eau */}
      <rect x={bachX+4} y={waterY} width={bachW-8} height={bachY+bachH-waterY-4} fill="url(#eau)"/>
      {[0,1].map(i=><line key={i} x1={bachX+10+i*35} y1={waterY+6} x2={bachX+24+i*35} y2={waterY+6}
        stroke="white" strokeWidth="1" opacity="0.8"/>)}
      {/* NHE */}
      <line x1={bachX} y1={waterY} x2={bachX+bachW} y2={waterY}
        stroke="#2563eb" strokeWidth="0.8" strokeDasharray="4 2"/>
      <text x={bachX+bachW+4} y={waterY+4} fontSize="7" fill="#2563eb">NHE</text>
      <text x={bachX+bachW/2} y={bachY-6} textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#475569">
        {isC?'RÉSERVOIR':'BÂCHE'}
      </text>

      {/* ══════════════════════════════════
           TUYAUTERIE ASPIRATION
           3 configurations avec labels DN + longueur
         ══════════════════════════════════ */}
      {(()=>{
        // Point de sortie de la bâche (côté droit)
        const bSortieX=bachX+bachW;
        const bSortieY=isC?waterY+20:isL?waterY+20:bachY+bachH-20; // sortie selon config

        if(isC){
          // ── EN CHARGE : réservoir surélevé, tuyau descend horizontal puis vertical vers pompes
          // Tuyau horizontal depuis bâche vers pompes
          const aspHorizY=pCY+16; // axe aspiration horizontal = entrée pompe
          return <>
            {/* Tuyau horizontal bâche → 1ère pompe */}
            <line x1={bSortieX} y1={aspHorizY} x2={pX0+(tot-1)*pSp+16} y2={aspHorizY}
              stroke="#1e293b" strokeWidth="2.5"/>
            {/* Descente verticale depuis bâche jusqu'à la ligne aspiration */}
            <line x1={bSortieX} y1={bSortieY} x2={bSortieX} y2={aspHorizY}
              stroke="#1e293b" strokeWidth="2.5"/>
            {/* Label conduite aspiration */}
            <text x={bSortieX+6} y={(bSortieY+aspHorizY)/2} fontSize="7" fill="#475569">
              DN{c.dn_asp}
            </text>
            <text x={bSortieX+6} y={(bSortieY+aspHorizY)/2+10} fontSize="7" fill="#475569">
              {c.mat_asp}
            </text>
            {/* Label longueur horizontal */}
            <text x={(bSortieX+pX0)/2} y={aspHorizY-7} textAnchor="middle" fontSize="7" fill="#475569">
              DN{c.dn_asp} — {c.mat_asp} — L≈{c.l_asp}m
            </text>
            {/* Cote hauteur géométrique */}
            <line x1={bachX-14} y1={waterY} x2={bachX-14} y2={aspHorizY}
              stroke="#dc2626" strokeWidth="0.8" markerStart="url(#arrR)" markerEnd="url(#arrR)"/>
            <text x={bachX-30} y={(waterY+aspHorizY)/2+3} textAnchor="middle" fontSize="7" fill="#dc2626"
              fontWeight="700" transform={`rotate(-90,${bachX-30},${(waterY+aspHorizY)/2})`}>
              Hgéo={c.h_geo}m
            </text>
            {/* Hasp (dénivelé aspiration) */}
            <line x1={pX0-18} y1={waterY} x2={pX0-18} y2={aspHorizY}
              stroke="#7c3aed" strokeWidth="0.8" markerStart="url(#arrR)" markerEnd="url(#arrR)"/>
            <text x={pX0-32} y={(waterY+aspHorizY)/2+3} textAnchor="middle" fontSize="7" fill="#7c3aed"
              fontWeight="700" transform={`rotate(-90,${pX0-32},${(waterY+aspHorizY)/2})`}>
              Hasp={c.hasp}m
            </text>
            {/* Crépine */}
            {a.crepine&&<>
              <PIDCrepine cx={bSortieX+18} cy={aspHorizY} h={11}/>
              <line x1={bSortieX+18} y1={aspHorizY-11} x2={bSortieX+18} y2={aspHorizY}
                stroke="#64748b" strokeWidth="0.8"/>
            </>}
            {/* Vanne aspiration */}
            {a.v_asp&&<>
              <PIDVanne cx={bSortieX+60} cy={aspHorizY} h={9} horiz={true}/>
              <text x={bSortieX+60} y={aspHorizY+20} textAnchor="middle" fontSize="7" fill="#1e293b">VIA</text>
            </>}
            {/* Manomètre aspiration */}
            {a.mano_asp&&<>
              <line x1={bSortieX+105} y1={aspHorizY} x2={bSortieX+105} y2={aspHorizY-18} stroke="#1e293b" strokeWidth="0.8"/>
              <PIDMano cx={bSortieX+105} cy={aspHorizY-27} r={9}/>
            </>}
            {/* Badge NPSHd */}
            {H.NPSHd&&<rect x={bSortieX+30} y={aspHorizY+28} width={130} height={28} rx="3"
              fill={H.cav?'#fff1f2':'#f0fdf4'} stroke={H.cav?'#fca5a5':'#86efac'} strokeWidth="1.2"/>}
            {H.NPSHd&&<text x={bSortieX+95} y={aspHorizY+40} textAnchor="middle" fontSize="7" fontWeight="700"
              fill={H.cav?'#dc2626':'#16a34a'}>
              NPSHd = {H.NPSHd} m {H.cav?'⚠ CAVIT.':'✓ OK'}
            </text>}
            {H.NPSHd&&<text x={bSortieX+95} y={aspHorizY+52} textAnchor="middle" fontSize="6.5"
              fill={H.cav?'#ef4444':'#15803d'}>
              NPSHr = {c.npsh_req} m (constructeur)
            </text>}
            {/* Label config */}
            <rect x={bachX} y={bachY+bachH+8} width={bachW} height={22} rx="3" fill="#dbeafe" stroke="#2563eb" strokeWidth="0.8"/>
            <text x={bachX+bachW/2} y={bachY+bachH+23} textAnchor="middle" fontSize="7" fontWeight="700" fill="#1d4ed8">
              ① ASPIRATION EN CHARGE
            </text>
          </>;
        }

        if(isL){
          // ── NIVEAU ÉGAL : bâche et pompe au même niveau, tuyau horizontal
          const aspHorizY=pCY+16;
          return <>
            <line x1={bSortieX} y1={aspHorizY} x2={pX0+(tot-1)*pSp+16} y2={aspHorizY}
              stroke="#1e293b" strokeWidth="2.5"/>
            <text x={(bSortieX+pX0)/2} y={aspHorizY-7} textAnchor="middle" fontSize="7" fill="#475569">
              DN{c.dn_asp} — {c.mat_asp} — L≈{c.l_asp}m
            </text>
            {/* Jonction bâche → tuyau */}
            <line x1={bSortieX} y1={bSortieY} x2={bSortieX} y2={aspHorizY}
              stroke="#1e293b" strokeWidth="2.5"/>
            {/* Cotes */}
            <line x1={bachX-14} y1={waterY} x2={bachX-14} y2={aspHorizY}
              stroke="#dc2626" strokeWidth="0.8" markerStart="url(#arrR)" markerEnd="url(#arrR)"/>
            <text x={bachX-28} y={(waterY+aspHorizY)/2+3} textAnchor="middle" fontSize="7" fill="#dc2626"
              fontWeight="700" transform={`rotate(-90,${bachX-28},${(waterY+aspHorizY)/2})`}>
              Hgéo={c.h_geo}m
            </text>
            {a.crepine&&<>
              <PIDCrepine cx={bSortieX+18} cy={aspHorizY} h={11}/>
              <line x1={bSortieX+18} y1={aspHorizY-11} x2={bSortieX+18} y2={aspHorizY} stroke="#64748b" strokeWidth="0.8"/>
            </>}
            {a.v_asp&&<>
              <PIDVanne cx={bSortieX+60} cy={aspHorizY} h={9} horiz={true}/>
              <text x={bSortieX+60} y={aspHorizY+20} textAnchor="middle" fontSize="7" fill="#1e293b">VIA</text>
            </>}
            {a.mano_asp&&<>
              <line x1={bSortieX+105} y1={aspHorizY} x2={bSortieX+105} y2={aspHorizY-18} stroke="#1e293b" strokeWidth="0.8"/>
              <PIDMano cx={bSortieX+105} cy={aspHorizY-27} r={9}/>
            </>}
            {H.NPSHd&&<rect x={bSortieX+30} y={aspHorizY+28} width={130} height={28} rx="3"
              fill={H.cav?'#fff1f2':'#f0fdf4'} stroke={H.cav?'#fca5a5':'#86efac'} strokeWidth="1.2"/>}
            {H.NPSHd&&<text x={bSortieX+95} y={aspHorizY+40} textAnchor="middle" fontSize="7" fontWeight="700"
              fill={H.cav?'#dc2626':'#16a34a'}>
              NPSHd = {H.NPSHd} m {H.cav?'⚠ CAVIT.':'✓ OK'}
            </text>}
            {H.NPSHd&&<text x={bSortieX+95} y={aspHorizY+52} textAnchor="middle" fontSize="6.5"
              fill={H.cav?'#ef4444':'#15803d'}>
              NPSHr = {c.npsh_req} m
            </text>}
            <rect x={bachX} y={bachY+bachH+8} width={bachW} height={22} rx="3" fill="#fef9c3" stroke="#ca8a04" strokeWidth="0.8"/>
            <text x={bachX+bachW/2} y={bachY+bachH+23} textAnchor="middle" fontSize="7" fontWeight="700" fill="#854d0e">
              ② NIVEAU ÉGAL
            </text>
          </>;
        }

        // ── EN DÉPRESSION (suction_lift) : bâche en bas, pompe au-dessus
        // Tuyau monte verticalement depuis bâche vers pompe
        const aspHorizY=pCY+16;
        return <>
          {/* Tuyau horizontal vers pompes */}
          <line x1={bSortieX} y1={aspHorizY} x2={pX0+(tot-1)*pSp+16} y2={aspHorizY}
            stroke="#1e293b" strokeWidth="2.5"/>
          <text x={(bSortieX+pX0)/2} y={aspHorizY-7} textAnchor="middle" fontSize="7" fill="#475569">
            DN{c.dn_asp} — {c.mat_asp} — L≈{c.l_asp}m
          </text>
          {/* Montée verticale depuis bâche */}
          <line x1={bSortieX} y1={bachY} x2={bSortieX} y2={aspHorizY}
            stroke="#1e293b" strokeWidth="2.5"/>
          <text x={bSortieX+6} y={(bachY+aspHorizY)/2+3} fontSize="7" fill="#475569">
            DN{c.dn_asp}
          </text>
          {/* Cote Hasp (hauteur de levée) */}
          <line x1={pX0-18} y1={aspHorizY} x2={pX0-18} y2={bachY+bachH/2}
            stroke="#dc2626" strokeWidth="0.8" markerStart="url(#arrR)" markerEnd="url(#arrR)"/>
          <text x={pX0-32} y={(aspHorizY+bachY+bachH/2)/2+3} textAnchor="middle" fontSize="7" fill="#dc2626"
            fontWeight="700" transform={`rotate(-90,${pX0-32},${(aspHorizY+bachY+bachH/2)/2})`}>
            Hasp={c.hasp}m
          </text>
          {/* Cote géométrique totale */}
          <line x1={bachX-14} y1={bachY+bachH-20} x2={bachX-14} y2={colY+8}
            stroke="#7c3aed" strokeWidth="0.8" markerStart="url(#arrR)" markerEnd="url(#arrR)"/>
          <text x={bachX-28} y={(bachY+bachH-20+colY+8)/2+3} textAnchor="middle" fontSize="7" fill="#7c3aed"
            fontWeight="700" transform={`rotate(-90,${bachX-28},${(bachY+bachH-20+colY+8)/2})`}>
            Hgéo={c.h_geo}m
          </text>
          {/* Crépine en bas */}
          {a.crepine&&<>
            <line x1={bSortieX} y1={bachY+bachH} x2={bSortieX} y2={bachY+bachH+12} stroke="#64748b" strokeWidth="0.8"/>
            <PIDCrepine cx={bSortieX} cy={bachY+bachH+12} h={11}/>
          </>}
          {a.v_asp&&<>
            <PIDVanne cx={bSortieX+60} cy={aspHorizY} h={9} horiz={true}/>
            <text x={bSortieX+60} y={aspHorizY+20} textAnchor="middle" fontSize="7" fill="#1e293b">VIA</text>
          </>}
          {a.mano_asp&&<>
            <line x1={bSortieX+105} y1={aspHorizY} x2={bSortieX+105} y2={aspHorizY-18} stroke="#1e293b" strokeWidth="0.8"/>
            <PIDMano cx={bSortieX+105} cy={aspHorizY-27} r={9}/>
          </>}
          {H.NPSHd&&<rect x={bSortieX+30} y={aspHorizY+28} width={140} height={28} rx="3"
            fill={H.cav?'#fff1f2':'#f0fdf4'} stroke={H.cav?'#fca5a5':'#86efac'} strokeWidth="1.2"/>}
          {H.NPSHd&&<text x={bSortieX+100} y={aspHorizY+40} textAnchor="middle" fontSize="7" fontWeight="700"
            fill={H.cav?'#dc2626':'#16a34a'}>
            NPSHd = {H.NPSHd} m {H.cav?'⚠ CAVIT.':'✓ OK'}
          </text>}
          {H.NPSHd&&<text x={bSortieX+100} y={aspHorizY+52} textAnchor="middle" fontSize="6.5"
            fill={H.cav?'#ef4444':'#15803d'}>
            NPSHr = {c.npsh_req} m (constructeur)
          </text>}
          <rect x={bachX} y={bachY+bachH+8} width={bachW} height={22} rx="3" fill="#fee2e2" stroke="#dc2626" strokeWidth="0.8"/>
          <text x={bachX+bachW/2} y={bachY+bachH+23} textAnchor="middle" fontSize="7" fontWeight="700" fill="#991b1b">
            ③ ASPIRATION EN DÉPRESSION
          </text>
        </>;
      })()}

      {/* ══════════════════════════════════
           POMPES — layout propre
           Moteur AU-DESSUS | Pompe | Colonne refoulement vers collecteur
           Clapet + Vanne bien espacés sur la colonne
         ══════════════════════════════════ */}
      {[...Array(tot)].map((_,i)=>{
        const px=pX0+i*pSp;
        const stb=i>=np;
        const pc=stb?'#94a3b8':tc;
        // Zones fixes verticales (de bas en haut) :
        //   aspY (entrée pompe bas)  →  pCY (centre pompe)  →  viaRefY  →  clapY  →  colY (collecteur)
        const aspEntreeY=pCY+16;
        const viaRefY=colY+78;
        const clapY=colY+52;
        return <g key={i}>
          {/* Colonne asp individuelle verticale (depuis ligne asp → pompe) */}
          <line x1={px} y1={aspEntreeY} x2={px} y2={pCY+16} stroke={pc} strokeWidth="1.8"/>

          {/* ── POMPE ── */}
          <PIDPompe cx={px} cy={pCY} r={16} label={stb?`P${i+1}S`:`P${i+1}`} stb={stb} color={tc}/>

          {/* Liaison pompe → moteur (vertical) */}
          <line x1={px} y1={pCY-16} x2={px} y2={mCY+11} stroke={pc} strokeWidth="1.2"/>
          {/* ── MOTEUR AU-DESSUS ── */}
          <PIDMoteur cx={px} cy={mCY} r={11} stb={stb}/>
          <text x={px} y={mCY-15} textAnchor="middle" fontSize="6" fill="#64748b">
            ≈{(parseFloat(H.Pa||0)/Math.max(np,1)).toFixed(1)}kW
          </text>
          <text x={px} y={pCY+32} textAnchor="middle" fontSize="6.5" fill={pc} fontWeight={stb?400:600}>
            {stb?'SECOURS':'SERVICE'}
          </text>

          {/* Colonne refoulement verticale (pompe → collecteur) */}
          <line x1={px} y1={pCY-16} x2={px} y2={colY+8} stroke={pc} strokeWidth="1.8"/>

          {/* Vanne refoulement (VIR) */}
          {a.v_ref&&<>
            <PIDVanne cx={px} cy={viaRefY} h={9} horiz={false}/>
            <text x={px+13} y={viaRefY+3} fontSize="7" fill="#1e293b">VIR</text>
          </>}
          {/* Clapet anti-retour (CAR) — au-dessus de la vanne */}
          {a.clapet&&<>
            <PIDClapet cx={px} cy={clapY} h={9} horiz={false}/>
            <text x={px+13} y={clapY+3} fontSize="7" fill="#475569">CAR</text>
          </>}
          {/* Manomètre refoulement (piqûre horizontale droite) */}
          {a.mano_ref&&<>
            <line x1={px+16} y1={pCY-6} x2={px+30} y2={pCY-6} stroke="#1e293b" strokeWidth="0.8"/>
            <PIDMano cx={px+39} cy={pCY-6} r={8}/>
          </>}
        </g>;
      })}

      {/* ══════════════════════════════════
           COLLECTEUR REFOULEMENT
           + label DN et matériau
         ══════════════════════════════════ */}
      <line x1={pX0} y1={colY+8} x2={lastPX+40} y2={colY+8} stroke="#1e293b" strokeWidth="3"/>
      {tot>1&&<text x={(pX0+lastPX+40)/2} y={colY-2} textAnchor="middle" fontSize="7.5" fill="#1e293b" fontWeight="600">
        COLLECTEUR DN{c.dn_ref} — {c.mat_ref}
      </text>}

      {/* ══════════════════════════════════
           LIGNE RÉSEAU → droite
           avec DN, longueur, accessoires
         ══════════════════════════════════ */}
      {(()=>{
        const rStartX=lastPX+40;
        const rY=colY+8;
        return <>
          <line x1={rStartX} y1={rY} x2={820} y2={rY} stroke="#1e293b" strokeWidth="2.5"/>
          <text x={(rStartX+820)/2} y={rY+14} textAnchor="middle" fontSize="7" fill="#475569">
            DN{c.dn_ref} — {c.mat_ref} — L≈{c.l_ref}m
          </text>
          {/* Débitmètre */}
          {a.debit&&<>
            <PIDDebit cx={rStartX+65} cy={rY}/>
            <text x={rStartX+65} y={rY-16} textAnchor="middle" fontSize="7" fill="#475569">FT-01</text>
          </>}
          {/* Réservoir à vessie */}
          {a.vv&&<>
            <line x1={rStartX+140} y1={rY} x2={rStartX+140} y2={rY-28} stroke="#1e293b" strokeWidth="1.2"/>
            <PIDVessie cx={rStartX+140} cy={rY-50}/>
          </>}
          {/* Soupape sécurité */}
          {a.soupape&&<>
            <line x1={rStartX+195} y1={rY} x2={rStartX+195} y2={rY-12} stroke="#dc2626" strokeWidth="1"/>
            <PIDSoupape cx={rStartX+195} cy={rY-22}/>
          </>}
          {/* Sonde pression */}
          {a.cap_p&&<>
            <line x1={800} y1={rY} x2={800} y2={rY-18} stroke="#1e293b" strokeWidth="0.8"/>
            <PIDTag cx={800} cy={rY-27} tag="PT" r={9}/>
            <text x={800} y={rY-40} textAnchor="middle" fontSize="7" fill="#475569">PT-01</text>
          </>}
          {/* Joint dilatation */}
          {a.jt_dil&&<>
            <line x1={rStartX+230} y1={rY-8} x2={rStartX+246} y2={rY+8} stroke="#1e293b" strokeWidth="1.2"/>
            <line x1={rStartX+246} y1={rY-8} x2={rStartX+230} y2={rY+8} stroke="#1e293b" strokeWidth="1.2"/>
            <text x={rStartX+238} y={rY+20} textAnchor="middle" fontSize="6.5" fill="#475569">JD</text>
          </>}
          {/* Flèche réseau */}
          <line x1={820} y1={rY} x2={842} y2={rY} stroke="#1e293b" strokeWidth="2.5" markerEnd="url(#arr)"/>
          <text x={852} y={rY+4} fontSize="9" fontWeight="700" fill="#059669">→ RÉSEAU</text>
          <text x={852} y={rY+18} fontSize="7" fill="#64748b">Q={c.Q}m³/h</text>
          <text x={852} y={rY+30} fontSize="7" fill="#64748b">HMT={H.HMT}m</text>
        </>;
      })()}

      {/* ══════════════════════════════════
           BILAN HYDRAULIQUE — droite
         ══════════════════════════════════ */}
      <rect x={840} y={200} width={240} height={195} fill="#f8fafc" stroke="#1e293b" strokeWidth="1.2"/>
      <rect x={840} y={200} width={240} height={22} fill="#1e293b"/>
      <text x={960} y={215} textAnchor="middle" fontSize="8.5" fontWeight="700" fill="white">BILAN HYDRAULIQUE</text>
      {[
        {l:`Q = ${c.Q} m³/h`, c:'#1e293b'},
        {l:`Config. : ${isC?'En charge':isL?'Niveau égal':'En dépression'}`, c:'#2563eb'},
        {l:`H.géo = ${c.h_geo} m | Hasp = ${c.hasp} m`, c:'#1e293b'},
        {l:`L.asp = ${c.l_asp} m | DN${c.dn_asp} ${c.mat_asp}`, c:'#475569'},
        {l:`L.ref = ${c.l_ref} m | DN${c.dn_ref} ${c.mat_ref}`, c:'#475569'},
        {l:`J.asp = ${H.Ja} m | J.ref = ${H.Jr} m`, c:'#1e293b'},
        {l:`HMT = ${H.HMT} m`, c:'#059669', b:true},
        {l:`Pa ≈ ${H.Pa} kW`, c:'#7c3aed', b:true},
        {l:`Va = ${H.Va} m/s | Vr = ${H.Vr} m/s`, c:'#1e293b'},
        {l:`NPSHd = ${H.NPSHd} m ${H.cav?'⚠ CAVIT.':'✓ OK'}`, c:H.cav?'#dc2626':'#16a34a', b:H.cav},
        {l:`${tot} pompes (${np} serv. + ${ns} sec.)`, c:'#2563eb'},
      ].map((r,i)=>(
        <text key={i} x={848} y={232+i*15} fontSize="7.8" fill={r.c} fontWeight={r.b?700:400}>{r.l}</text>
      ))}

      {CartouchePID({Q:c.Q, HMT:H.HMT, titre:`SCHÉMA DE PRINCIPE — ${titre}`, sousTitre:c.proj})}
    </svg>);
  };

  const renderSchema = () => {
    if(t==='forage') return <SchemaForage/>;
    if(t==='relevage') return <SchemaRelevage/>;
    return <SchemaSurface/>;
  };

  const doPrint = () => {
    const el=document.getElementById('hydraulic-schema');
    if(!el) return;
    const svg=new XMLSerializer().serializeToString(el);
    const w=window.open('','_blank');
    w.document.write(`<!DOCTYPE html><html><head><title>Schéma — ${cfg.proj}</title>
    <style>body{margin:0;padding:16px;background:white;font-family:Arial,sans-serif}
    h2{font-size:14px;color:#1e293b;margin:0 0 4px}p{font-size:10px;color:#64748b;margin:0 0 10px}
    svg{width:100%;max-width:1100px;height:auto;display:block}
    @media print{body{padding:4px}@page{size:A4 landscape;margin:6mm}}</style>
    </head><body><h2>Schéma Hydraulique — ${cfg.proj}</h2><p>ECO-PUMP AFRIK | v4.0 | ${cfg.date}</p>
    ${svg}<script>window.onload=()=>window.print()<\/script></body></html>`);
    w.document.close();
  };

  // ── UI helpers ──
  const FI = ({label,k,unit='',s=1,note}) => {
    // Utilise un state local string pour permettre l'édition libre (suppression, saisie libre)
    const [raw, setRaw] = React.useState(String(cfg[k] ?? ''));
    // Synchronise si la valeur externe change (ex: reset)
    React.useEffect(() => { setRaw(String(cfg[k] ?? '')); }, [cfg[k]]);
    const commit = (val) => {
      const n = parseFloat(val);
      if (!isNaN(n)) S(k, n);
      else setRaw(String(cfg[k] ?? ''));
    };
    return (
    <div>
      <label style={{display:'block',fontSize:'0.78rem',fontWeight:600,color:'#374151',marginBottom:'3px'}}>
        {label}{unit&&<span style={{color:'#9ca3af',fontWeight:400}}> ({unit})</span>}
      </label>
      <input
        type="text"
        inputMode="decimal"
        value={raw}
        step={s}
        onChange={e => setRaw(e.target.value)}
        onBlur={e => commit(e.target.value)}
        onKeyDown={e => { if(e.key==='Enter') { e.target.blur(); } }}
        onFocus={e => e.target.select()}
        style={{width:'100%',padding:'7px 10px',border:'1.5px solid #e5e7eb',borderRadius:'5px',fontSize:'0.85rem',boxSizing:'border-box'}}
      />
      {note&&<p style={{fontSize:'0.68rem',color:'#9ca3af',margin:'2px 0 0'}}>{note}</p>}
    </div>
  );};
  const SI = ({label,k,opts}) => (
    <div>
      <label style={{display:'block',fontSize:'0.78rem',fontWeight:600,color:'#374151',marginBottom:'3px'}}>{label}</label>
      <select value={cfg[k]} onChange={e=>S(k,e.target.value)}
        style={{width:'100%',padding:'7px 10px',border:'1.5px solid #e5e7eb',borderRadius:'5px',fontSize:'0.85rem',appearance:'none'}}>
        {opts.map(o=><option key={o}>{o}</option>)}
      </select>
    </div>
  );
  const TI = ({title,color}) => (
    <div style={{fontWeight:700,fontSize:'0.75rem',color,borderBottom:`2px solid ${color}`,paddingBottom:'4px',marginBottom:'8px',marginTop:'12px',textTransform:'uppercase',letterSpacing:'0.05em'}}>{title}</div>
  );
  const accDefs = [
    {g:'Instrumentation',c:'#2563eb',items:[
      {k:'mano_asp',l:'Manomètre Aspiration',t:['surface','surpression','incendie']},
      {k:'mano_ref',l:'Manomètre Refoulement',t:['surface','surpression','incendie','relevage','forage']},
      {k:'debit',   l:'Débitmètre',           t:['surface','surpression','incendie','relevage','forage']},
      {k:'cap_p',   l:'Capteur Pression',     t:['surface','surpression','incendie']},
    ]},
    {g:'Vannes & Robinetterie',c:'#059669',items:[
      {k:'v_asp',  l:'Vanne Isolement Asp.',t:['surface','surpression','incendie']},
      {k:'v_ref',  l:'Vanne Isolement Ref.',t:['surface','surpression','incendie','relevage','forage']},
      {k:'clapet', l:'Clapet Anti-Retour',  t:['surface','surpression','incendie','relevage','forage']},
      {k:'soupape',l:'Soupape Sécurité',    t:['surface','surpression','incendie']},
    ]},
    {g:'Équipements Mécaniques',c:'#d97706',items:[
      {k:'crepine',l:'Crépine / Filtre',   t:['surface','surpression','incendie','forage']},
      {k:'jt_dil', l:'Joint Dilatation',   t:['surface','surpression','incendie']},
      {k:'vv',     l:'Réservoir à Vessie', t:['surpression']},
      {k:'manifold',l:'Manifold Collecteur',t:['surface','surpression','incendie','relevage']},
    ]},
    {g:'Électrique & Régulation',c:'#7c3aed',items:[
      {k:'coffret',l:'Coffret Commande',   t:['surface','surpression','incendie','relevage','forage']},
      {k:'vfd',    l:'Variateur Fréquence',t:['surface','surpression']},
      {k:'fl_h',   l:'Flotteur Haut (NHE)',t:['relevage']},
      {k:'fl_b',   l:'Flotteur Bas (NBE)', t:['relevage']},
    ]},
  ];

  return (
    <div className="fade-in" style={{display:'flex',flexDirection:'column',gap:'16px'}}>
      {/* Header */}
      <div style={{background:'linear-gradient(135deg,#0f172a,#1e293b)',borderRadius:'12px',padding:'22px 26px',color:'white',border:'1px solid rgba(20,184,166,0.2)'}}>
        <div style={{fontSize:'0.68rem',fontWeight:700,letterSpacing:'0.12em',color:'#14b8a6',textTransform:'uppercase',marginBottom:'4px'}}>Outil Professionnel</div>
        <h2 style={{fontSize:'1.35rem',fontWeight:800,marginBottom:'4px'}}>📐 Générateur de Schéma Hydraulique</h2>
        <p style={{color:'rgba(255,255,255,0.45)',fontSize:'0.8rem',margin:0}}>Symboles normalisés ISO | Calculs auto | Export PDF A4 paysage</p>
      </div>
      {/* Steps */}
      <div style={{display:'flex',background:'white',borderRadius:'8px',border:'1px solid #e5e7eb',overflow:'hidden'}}>
        {['Type','Données','Accessoires','Schéma'].map((s,i)=>(
          <div key={i} onClick={()=>setStep(i+1)} style={{flex:1,padding:'9px 6px',textAlign:'center',cursor:'pointer',borderRight:i<3?'1px solid #e5e7eb':'none',background:step===i+1?'#f0fdfa':'white',borderBottom:step===i+1?'3px solid #14b8a6':'3px solid transparent'}}>
            <div style={{fontSize:'0.6rem',fontWeight:700,color:step===i+1?'#0f766e':'#9ca3af',textTransform:'uppercase'}}>{i+1}</div>
            <div style={{fontSize:'0.8rem',fontWeight:600,color:step===i+1?'#134e4a':'#6b7280'}}>{s}</div>
          </div>
        ))}
      </div>

      {/* ÉTAPE 1 */}
      {step===1 && (
        <div className="card">
          <div className="card-header"><div className="card-title">🏗️ Type d'installation</div></div>
          <div className="card-body">
            <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'8px',marginBottom:'18px'}}>
              {TYPES.map(tp=>(
                <div key={tp.id} onClick={()=>{S('type',tp.id);if(!tp.hasAsp)S('asp','flooded');S('ns',0);}}
                  style={{border:`2px solid ${cfg.type===tp.id?'#14b8a6':'#e5e7eb'}`,borderRadius:'8px',padding:'12px 8px',cursor:'pointer',textAlign:'center',background:cfg.type===tp.id?'#f0fdfa':'white'}}>
                  <div style={{fontSize:'1.5rem',marginBottom:'4px'}}>{tp.icon}</div>
                  <div style={{fontWeight:700,fontSize:'0.75rem',color:cfg.type===tp.id?'#0f766e':'#1e293b'}}>{tp.label}</div>
                  <div style={{fontSize:'0.62rem',color:'#9ca3af',marginTop:'2px'}}>Max {tp.maxP}P</div>
                </div>
              ))}
            </div>
            {CT.hasAsp && (
              <div style={{marginBottom:'16px'}}>
                <div style={{fontWeight:700,marginBottom:'8px',fontSize:'0.85rem'}}>Type d'aspiration</div>
                <div style={{display:'flex',gap:'8px'}}>
                  {[{id:'flooded',l:'① En charge',d:'Réservoir surélevé',c:'#16a34a',bg:'#dcfce7'},
                    {id:'level',l:'② Niveau égal',d:'Réservoir au sol',c:'#b45309',bg:'#fef9c3'},
                    {id:'suction_lift',l:'③ En dépression',d:'Pompe au-dessus',c:'#dc2626',bg:'#fee2e2'}
                  ].map(s=>(
                    <div key={s.id} onClick={()=>S('asp',s.id)}
                      style={{flex:1,border:`2px solid ${cfg.asp===s.id?s.c:'#e5e7eb'}`,borderRadius:'7px',padding:'8px',cursor:'pointer',background:cfg.asp===s.id?s.bg:'white'}}>
                      <div style={{fontWeight:700,fontSize:'0.8rem',color:cfg.asp===s.id?s.c:'#1e293b'}}>{s.l}</div>
                      <div style={{fontSize:'0.7rem',color:'#6b7280'}}>{s.d}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
              <div>
                <label style={{display:'block',fontWeight:600,fontSize:'0.8rem',marginBottom:'5px'}}>Pompes en service</label>
                <select value={cfg.np} onChange={e=>{const v=parseInt(e.target.value);S('np',v);S('ns',Math.min(cfg.ns,maxP-v));}}
                onFocus={e=>e.target.select()}
                onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                  style={{width:'100%',padding:'8px 10px',border:'1.5px solid #e5e7eb',borderRadius:'5px',fontSize:'0.875rem',appearance:'none'}}>
                  {[...Array(maxP)].map((_,i)=><option key={i+1} value={i+1}>{i+1} pompe{i>0?'s':''} service</option>)}
                </select>
              </div>
              {t!=='forage' && (
                <div>
                  <label style={{display:'block',fontWeight:600,fontSize:'0.8rem',marginBottom:'5px'}}>Pompes de secours</label>
                  <select value={cfg.ns} onChange={e=>S('ns',parseInt(e.target.value))}
                  onFocus={e=>e.target.select()}
                  onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
                    style={{width:'100%',padding:'8px 10px',border:'1.5px solid #e5e7eb',borderRadius:'5px',fontSize:'0.875rem',appearance:'none'}}>
                    {standby.map(n=><option key={n} value={n}>{n===0?'Aucune':n+` pompe${n>1?'s':''} secours`}</option>)}
                  </select>
                </div>
              )}
            </div>
            <div style={{background:'#f0fdfa',border:'1px solid #99f6e4',borderRadius:'8px',padding:'10px',marginTop:'12px',fontSize:'0.83rem'}}>
              <strong style={{color:'#0f766e'}}>{CT.label}</strong>
              {CT.hasAsp&&<span style={{color:'#0d9488'}}> — {cfg.asp==='flooded'?'En charge':cfg.asp==='level'?'Niveau égal':'En dépression'}</span>}
              <span style={{color:'#6b7280'}}> | {cfg.np} service + {cfg.ns} secours</span>
            </div>
            <button onClick={()=>setStep(2)} style={{marginTop:'14px',width:'100%',background:'linear-gradient(135deg,#14b8a6,#0f766e)',color:'white',padding:'11px',borderRadius:'8px',border:'none',cursor:'pointer',fontWeight:700}}>
              Suivant → Données système
            </button>
          </div>
        </div>
      )}

      {/* ÉTAPE 2 */}
      {step===2 && (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
          <div className="card">
            <div className="card-header"><div className="card-title">⚙️ {CT.label} — Données</div></div>
            <div className="card-body" style={{display:'flex',flexDirection:'column',gap:'9px'}}>
              {t==='forage'&&<>
                <TI title="Hydraulique forage" color="#1d4ed8"/>
                <FI label="Débit de pompage" k="Q_f" unit="m³/h"/>
                <FI label="Niveau dynamique" k="nd" unit="m" note="Profondeur eau en pompage"/>
                <FI label="Hauteur château d'eau" k="hch" unit="m" note="Hauteur finale de refoulement"/>
                <FI label="Longueur refoulement" k="l_f" unit="m"/>
                <FI label="Pression résiduelle" k="res_f" unit="bar" s={0.1}/>
                <TI title="Tuyauterie" color="#059669"/>
                <FI label="DN refoulement" k="dn_f" unit="mm"/>
                <SI label="Matériau" k="mat_f" opts={['PEHD','PVC','Acier inox','Acier galvanisé']}/>
              </>}
              {t==='relevage'&&<>
                <TI title="Hydraulique relevage" color="#4338ca"/>
                <FI label="Débit unitaire" k="Q_r" unit="m³/h" note="Par pompe en service"/>
                <FI label="Hauteur de refoulement" k="h_r" unit="m"/>
                <FI label="Longueur refoulement" k="l_r" unit="m"/>
                <TI title="Tuyauterie" color="#059669"/>
                <FI label="DN refoulement" k="dn_r" unit="mm"/>
              </>}
              {(t==='surface'||t==='surpression'||t==='incendie')&&<>
                <TI title="Hydraulique" color="#059669"/>
                <FI label="Débit total" k="Q" unit="m³/h"/>
                <FI label="Hauteur géométrique" k="h_geo" unit="m"/>
                <FI label="Hauteur aspiration Hasp" k="hasp" unit="m" note={cfg.asp==='flooded'?'Eau au-dessus pompe':'Hauteur de levée'}/>
                <FI label="Pression résiduelle" k="res_P" unit="bar" s={0.1}/>
                <TI title="Aspiration" color="#2563eb"/>
                <FI label="DN aspiration" k="dn_asp" unit="mm"/>
                <FI label="Longueur aspiration" k="l_asp" unit="m"/>
                <SI label="Matériau aspiration" k="mat_asp" opts={['PVC','PEHD','Acier','Fonte','Acier inox']}/>
                <FI label="NPSHr constructeur" k="npsh_req" unit="m" s={0.1}/>
                <TI title="Refoulement" color="#0891b2"/>
                <FI label="DN refoulement" k="dn_ref" unit="mm"/>
                <FI label="Longueur refoulement" k="l_ref" unit="m"/>
                <SI label="Matériau refoulement" k="mat_ref" opts={['Acier','PVC','PEHD','Fonte','Acier inox','Acier galv.']}/>
              </>}
              <TI title="Fluide & Électrique" color="#7c3aed"/>
              <SI label="Fluide pompé" k="fluid" opts={['Eau','Eau de mer','Eaux usées','Eaux chargées','Huile hydraulique','Diesel','Glycol']}/>
              <FI label="Température" k="temp" unit="°C"/>
              <SI label="Tension réseau" k="volt" opts={['400V - 50Hz','230V - 50Hz','380V - 50Hz','220V - 60Hz']}/>
              <SI label="Protection IP" k="prot" opts={['IP55','IP65','IP68']}/>
              <div>
                <label style={{display:'block',fontSize:'0.78rem',fontWeight:600,color:'#374151',marginBottom:'3px'}}>Nom du projet</label>
                <input type="text" value={cfg.proj} onChange={e=>S('proj',e.target.value)}
                  style={{width:'100%',padding:'7px 10px',border:'1.5px solid #e5e7eb',borderRadius:'5px',fontSize:'0.85rem'}}/>
              </div>
              <div style={{display:'flex',gap:'8px',marginTop:'6px'}}>
                <button onClick={()=>setStep(1)} style={{flex:1,padding:'9px',border:'1.5px solid #e5e7eb',borderRadius:'7px',cursor:'pointer',fontWeight:600,background:'white',fontSize:'0.85rem'}}>← Retour</button>
                <button onClick={()=>setStep(3)} style={{flex:2,background:'linear-gradient(135deg,#14b8a6,#0f766e)',color:'white',padding:'9px',borderRadius:'7px',border:'none',cursor:'pointer',fontWeight:700}}>Accessoires →</button>
              </div>
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
            <div className="card">
              <div className="card-header"><div className="card-title">📊 Résultats calculés</div></div>
              <div className="card-body" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
                {[
                  {l:'HMT totale',v:H.HMT,u:'m',c:'#059669'},
                  {l:'Puissance absorbée',v:H.Pa,u:'kW',c:'#7c3aed'},
                  H.Va&&{l:'V. aspiration',v:H.Va,u:'m/s',c:parseFloat(H.Va)>1.5?'#d97706':'#059669'},
                  H.Vr&&{l:'V. refoulement',v:H.Vr,u:'m/s',c:parseFloat(H.Vr)>2.5?'#d97706':'#059669'},
                  H.V&&{l:'Vitesse',v:H.V,u:'m/s',c:'#059669'},
                  H.NPSHd&&{l:'NPSHd',v:H.NPSHd,u:'m',c:H.cav?'#dc2626':'#059669'},
                  {l:'J. ref',v:H.Jr,u:'m',c:'#64748b'},
                  H.Hg&&{l:'H. géo',v:H.Hg,u:'m',c:'#1d4ed8'},
                ].filter(Boolean).map((r,i)=>(
                  <div key={i} style={{background:'#f8fafc',borderRadius:'7px',padding:'9px',textAlign:'center',borderTop:`2px solid ${r.c}`}}>
                    <div style={{fontSize:'1.2rem',fontWeight:800,color:r.c,fontFamily:'monospace'}}>{r.v}</div>
                    <div style={{fontSize:'0.68rem',fontWeight:700,color:r.c}}>{r.u}</div>
                    <div style={{fontSize:'0.65rem',color:'#64748b'}}>{r.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="card-header"><div className="card-title">👁️ Aperçu</div></div>
              <div style={{padding:'4px',background:'#f8fafc',borderRadius:'0 0 10px 10px',overflow:'hidden',height:'220px'}}>
                <div style={{transform:'scale(0.42)',transformOrigin:'top left',width:'238%',pointerEvents:'none'}}>
                  {renderSchema()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ÉTAPE 3 */}
      {step===3 && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">🔩 Accessoires</div>
            <span style={{background:'#f3e8ff',color:'#6b21a8',padding:'3px 10px',borderRadius:'20px',fontSize:'0.7rem',fontWeight:700}}>
              {accDefs.flatMap(g=>g.items.filter(i=>i.t.includes(t)&&acc[i.k])).length} sélectionnés
            </span>
          </div>
          <div className="card-body" style={{display:'flex',flexDirection:'column',gap:'14px'}}>
            {accDefs.map(g=>{
              const items=g.items.filter(i=>i.t.includes(t));
              if(!items.length) return null;
              return <div key={g.g}>
                <div style={{fontWeight:700,fontSize:'0.78rem',color:g.c,marginBottom:'7px',display:'flex',alignItems:'center',gap:'5px'}}>
                  <span style={{width:'6px',height:'6px',borderRadius:'50%',background:g.c,display:'inline-block'}}></span>{g.g}
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px'}}>
                  {items.map(item=>(
                    <div key={item.k} onClick={()=>T(item.k)}
                      style={{display:'flex',alignItems:'center',gap:'8px',padding:'8px 11px',border:`1.5px solid ${acc[item.k]?g.c:'#e5e7eb'}`,borderRadius:'6px',cursor:'pointer',background:acc[item.k]?g.c+'12':'white'}}>
                      <div style={{width:'15px',height:'15px',borderRadius:'3px',border:`2px solid ${acc[item.k]?g.c:'#d1d5db'}`,background:acc[item.k]?g.c:'white',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                        {acc[item.k]&&<span style={{color:'white',fontSize:'9px',fontWeight:700}}>✓</span>}
                      </div>
                      <span style={{fontSize:'0.78rem',fontWeight:500,color:acc[item.k]?'#1e293b':'#6b7280'}}>{item.l}</span>
                    </div>
                  ))}
                </div>
              </div>;
            })}
            <div style={{display:'flex',gap:'8px',marginTop:'6px'}}>
              <button onClick={()=>setStep(2)} style={{flex:1,padding:'10px',border:'1.5px solid #e5e7eb',borderRadius:'8px',cursor:'pointer',fontWeight:600,background:'white'}}>← Retour</button>
              <button onClick={()=>{setStep4(true);setStep(4);}} style={{flex:3,background:'linear-gradient(135deg,#6366f1,#4338ca)',color:'white',padding:'10px',borderRadius:'8px',border:'none',cursor:'pointer',fontWeight:700,fontSize:'0.95rem'}}>
                ⚡ Générer le Schéma
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ÉTAPE 4 */}
      {step===4&&step4&&(
        <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap',alignItems:'center'}}>
            <button onClick={()=>setStep(2)} style={{padding:'7px 13px',border:'1.5px solid #e5e7eb',borderRadius:'6px',cursor:'pointer',fontWeight:600,background:'white',fontSize:'0.82rem'}}>← Données</button>
            <button onClick={()=>setStep(3)} style={{padding:'7px 13px',border:'1.5px solid #a5b4fc',borderRadius:'6px',cursor:'pointer',fontWeight:600,background:'#f5f3ff',color:'#4338ca',fontSize:'0.82rem'}}>🔩 Accessoires</button>
            <button onClick={doPrint} style={{padding:'8px 20px',background:'linear-gradient(135deg,#ef4444,#dc2626)',color:'white',border:'none',borderRadius:'6px',cursor:'pointer',fontWeight:700,fontSize:'0.88rem',boxShadow:'0 4px 12px rgba(239,68,68,0.3)'}}>
              🖨️ Imprimer / PDF A4
            </button>
            <div style={{marginLeft:'auto',background:'#f0fdf4',border:'1px solid #86efac',borderRadius:'7px',padding:'5px 12px',fontSize:'0.75rem',fontWeight:700,color:'#15803d'}}>
              HMT = {H.HMT} m | Pa = {H.Pa} kW
            </div>
          </div>
          <div style={{background:'white',border:'1px solid #e5e7eb',borderRadius:'10px',overflow:'hidden',boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}>
            {renderSchema()}
          </div>
        </div>
      )}
    </div>
  );
};

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
                <input type="text" inputMode="decimal" value={data[f.key]} step={f.step}
                  onChange={e => set(f.key, parseFloat(e.target.value))}
                  onFocus={e=>e.target.select()}
                  onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
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

// ════════════════════════════════════════════════════════════════
// MODULE SÉLECTION DE POMPES — Base Grundfos CR/SP complète
// Source : Databooklets CR 50Hz (2026), SP 50Hz (2025), Tarif Pro 2025
// ════════════════════════════════════════════════════════════════

// ── Base de données Grundfos extraite des PDF techniques ──────────────

// ══════════════════════════════════════════════════════════════════════
// BASE DE DONNÉES POMPES GRUNDFOS — COURBES Q/H RÉELLES
// Source : Databooklets CR 50Hz 2026 + SP 50Hz 2025 (points lus sur courbes)
//
// Structure par modèle :
//   curve_qh : [[Q,H], ...] — points lus sur la courbe Q/H du 1er étage (stage)
//              Pour SP : c'est le H par étage. Total = stages × H_stage(Q)
//              Pour CR : points extraits directement pour chaque modèle (stages implicites)
//   curve_eta: [[Q,η%], ...] — courbe de rendement (commune à la famille)
//   H_stage   (SP uniquement) : H par étage = f(Q)
// ══════════════════════════════════════════════════════════════════════

// ── Utilitaires d'interpolation ───────────────────────────────────────
// Interpolation linéaire entre 2 points
const lerp = (x, x0, x1, y0, y1) => y0 + (y1 - y0) * (x - x0) / (x1 - x0);

// Interpolation sur tableau de points [[x,y]] trié par x croissant
const interpolate = (pts, x) => {
  if (!pts || pts.length === 0) return null;
  if (x <= pts[0][0]) return pts[0][1];
  if (x >= pts[pts.length-1][0]) return pts[pts.length-1][1];
  for (let i = 0; i < pts.length-1; i++) {
    if (x >= pts[i][0] && x <= pts[i+1][0]) {
      return lerp(x, pts[i][0], pts[i+1][0], pts[i][1], pts[i+1][1]);
    }
  }
  return null;
};

// Calcule HMT réelle, rendement, et puissance au débit Q
const calcAtQ = (pump, Q) => {
  // HMT via courbe
  const H = interpolate(pump.curve_qh, Q);
  if (H === null || H <= 0) return null;
  // Rendement via courbe eta
  const eta = pump.curve_eta ? interpolate(pump.curve_eta, Q) : pump.eta_bep;
  // Puissance hydraulique
  const Ph = (Q * 9.81 * 1000 * H) / 3600000; // kW
  const Pa = eta > 0 ? Ph / (eta/100) : null;
  return { H: parseFloat(H.toFixed(1)), eta: parseFloat(eta.toFixed(1)), Ph: parseFloat(Ph.toFixed(3)), Pa: parseFloat((Pa||0).toFixed(3)) };
};

// ── Courbes par étage (stage curves) pour familles SP ─────────────────
// Points lus sur les graphiques Q/H des databooklets
// Format : [Q m³/h, H_1étage m]


// ══════════════════════════════════════════════════════════════════════
// COURBES Q/H PAR ÉTAGE — Points précis lus sur les databooklets Grundfos
//
// RÈGLE FONDAMENTALE :
//   SP XA / SP X  → X = débit nominal en m³/h (Q_nom)
//   CR X          → X = débit nominal en m³/h (Q_nom)
//
// SP 1A : Q_nom=1 m³/h → Q_max réel ≈ 1.4 m³/h
// SP 2A : Q_nom=2 m³/h → Q_max réel ≈ 2.7 m³/h (vérifié Grundfos website)
// SP 3A : Q_nom=3 m³/h → Q_max réel ≈ 3.6 m³/h
// SP 5A : Q_nom=5 m³/h → Q_max réel ≈ 6.4 m³/h
// SP 7  : Q_nom=7 m³/h → Q_max réel ≈ 9.0 m³/h
// SP 9  : Q_nom=9 m³/h → Q_max réel ≈ 11.0 m³/h
// CR 1  : Q_nom=1 m³/h → Q_max réel ≈ 2.2 m³/h
// CR 5  : Q_nom=5 m³/h → Q_max réel ≈ 8.5 m³/h
// CR 10 : Q_nom=10 m³/h → Q_max réel ≈ 12 m³/h
// ══════════════════════════════════════════════════════════════════════

// Courbes H par étage lues sur les graphiques Q/H des databooklets
// Format : [[Q m³/h, H_1_étage m], ...]
const SP_STAGE_CURVES = {

  // ── SP 1A — Q_max réel 1.4 m³/h ─────────────────────────────────
  // Lu sur SP 1A PDF p.27 : étage 1 → H0≈5.7m à Q=0, H≈2m à Q=1.4
  // SP 1A-9 : H_total = 5.7×9 = 51m à Q=0 → ≈55m lu en haut de courbe -9
  'SP 1A': {
    qh1: [[0,5.7],[0.3,5.5],[0.6,5.2],[0.9,4.85],[1.0,4.44],[1.2,3.4],[1.4,2.0]],
    eta: [[0,0],[0.2,12],[0.4,22],[0.6,30],[0.8,36],[1.0,39],[1.2,38],[1.4,30]],
    Q_max:1.4
  },

  // ── SP 2A — Q_max réel 2.7 m³/h ─────────────────────────────────
  // Lu sur SP 2A PDF p.29 : courbe -6 → H≈40m à Q=0, ≈18m à Q=2.7
  // → H/stage = 40/6 ≈ 6.6m à Q=0, 18/6=3.0m à Q=2.7
  'SP 2A': {
    qh1: [[0,6.6],[0.4,6.4],[0.8,6.1],[1.2,5.8],[1.6,5.55],[2.0,5.25],[2.2,4.8],[2.4,3.9],[2.7,2.2]],
    eta: [[0,0],[0.4,15],[0.8,28],[1.2,38],[1.6,45],[2.0,48],[2.4,47],[2.7,42]],
    Q_max:2.7
  },

  // ── SP 3A — Q_max réel 3.6 m³/h ─────────────────────────────────
  // Lu sur SP 3A PDF p.31 : courbe -6 → H≈40m à Q=0, ≈18m à Q=3.6
  // → H/stage = 6.7m à Q=0, 3.0m à Q=3.6
  'SP 3A': {
    qh1: [[0,6.8],[0.4,6.6],[0.8,6.4],[1.2,6.1],[1.6,5.9],[2.0,5.7],[2.4,5.5],[3.0,5.45],[3.2,4.5],[3.6,2.2]],
    eta: [[0,0],[0.4,14],[0.8,26],[1.2,38],[1.6,48],[2.0,55],[2.4,58],[3.0,60],[3.2,59],[3.6,52]],
    Q_max:3.6
  },

  // ── SP 5A — Q_max réel 6.4 m³/h ─────────────────────────────────
  // Lu sur SP 5A PDF p.33 : courbe -4 → H≈41m à Q=0, ≈20m à Q=6.4
  // → H/stage ≈ 10.3m à Q=0, 5.0m à Q=6.4
  // SP 5A — calibré sur courbes PDF: SP5A-4@Q5=25m,SP5A-17@Q5=106m,SP5A-25@Q5=156m
  // H/stage à Q=5 = 6.25m (constant 4→25 stages) ✓ validé graphiquement
  'SP 5A': {
    qh1: [[0,10.25],[0.8,9.8],[1.6,9.35],[2.4,8.7],[3.2,7.8],[4.0,6.7],[4.8,5.3],[5.0,4.1],[5.2,3.8],[5.6,3.2],[6.0,2.5],[6.4,1.8]],
    eta: [[0,0],[0.8,18],[1.6,32],[2.4,44],[3.2,52],[4.0,58],[4.8,61],[5.4,61],[6.0,57],[6.4,52]],
    Q_max:6.4
  },

  // ── SP 7 — Q_max réel 9.0 m³/h ──────────────────────────────────
  // Lu sur SP 7 PDF p.35 : courbe -3 → H≈19m à Q=0, ≈9m à Q=9
  // → H/stage ≈ 6.3m à Q=0, 3.0m à Q=9
  // SP 7 — calibré sur courbes PDF: SP7-17@Q5=99m, SP7-23@Q5=134m ✓
  // H/stage@Q5 = 5.83m (lecture courbe -3 à Q=5: H≈17.5m -> 17.5/3=5.83m)
  'SP 7': {
    qh1: [[0,6.33],[1,6.2],[2,6.0],[3,5.95],[4,5.85],[5,5.78],[6,5.2],[7,4.5],[8,3.5],[9,2.2]],
    eta: [[0,0],[1,22],[2,38],[3,52],[4,60],[5,65],[6,68],[7,69],[8,67],[9,62]],
    Q_max:9.0
  },

  // ── SP 9 — Q_max réel 11.0 m³/h ─────────────────────────────────
  // Lu sur SP 9 PDF p.38 : courbe -4 → H≈27m à Q=0, ≈17m à Q=11
  // → H/stage ≈ 6.75m à Q=0, 4.25m à Q=11
  // SP 9 — recalibré sur courbe PDF p.38 (corrigé - H/stage BEAUCOUP plus élevé que estimé)
  // -4@Q0: H≈200m -> H/stage=50m | -4@Q9: H≈130m -> H/stage=32.5m | -4@Q11: H≈88m -> H/stage=22m
  // Q_max réel ≈ 11 m³/h
  'SP 9': {
    qh1: [[0,50.0],[1,49.3],[2,48.3],[3,47.0],[4,45.3],[5,43.2],[6,40.8],[7,38.0],[8,35.0],[9,32.5],[10,27.0],[11,21.0]],
    eta: [[0,0],[1,20],[2,36],[3,50],[4,60],[5,66],[6,70],[7,72],[8,73],[9,71],[10,67],[11,60]],
    Q_max:11.0
  },

  // ── SP 11 — Q_max réel 16.5 m³/h ────────────────────────────────
  'SP 11': {
    qh1: [[0,7.3],[2,7.1],[4,6.9],[6,6.7],[8,6.4],[10,6.1],[11,6.0],[12,5.5],[13,4.7],[14,3.5]],
    eta: [[0,0],[2,25],[4,44],[6,58],[8,65],[10,68],[11,70],[12,69],[13,65],[14,58]],
    Q_max:14.0
  },

  // ── SP 14 — Q_max réel 20 m³/h ───────────────────────────────────
  'SP 14': {
    qh1: [[0,6.0],[2,5.9],[4,5.8],[6,5.7],[8,5.65],[10,5.6],[12,5.55],[14,5.5],[15,5.0],[16,4.2],[17,3.2]],
    eta: [[0,0],[2,25],[5,44],[8,58],[11,65],[13,68],[14,70],[15,69],[16,65],[17,58]],
    Q_max:17.0
  },

  // ── SP 18 — Q_max réel 27 m³/h — 6" ─────────────────────────────
  'SP 18': {
    qh1: [[0,9.3],[3,9.1],[6,8.8],[9,8.5],[12,8.1],[15,7.7],[18,7.3],[20,6.5],[22,5.5],[24,4.4],[27,3.2]],
    eta: [[0,0],[4,35],[8,55],[12,67],[16,74],[18,76],[20,76],[22,74],[25,70],[27,64]],
    Q_max:27.0
  },

  // ── SP 32 — Q_max réel 45 m³/h — 6" ─────────────────────────────
  'SP 32': {
    qh1: [[0,10.0],[4,9.7],[8,9.3],[12,8.8],[16,8.3],[20,7.7],[24,7.0],[28,6.4],[32,5.6],[35,4.5],[38,3.0]],
    eta: [[0,0],[4,38],[10,58],[16,70],[22,76],[28,78],[32,79],[35,78],[38,72]],
    Q_max:38.0
  },

  // ── SP 46 — Q_max réel 60 m³/h — 6" ─────────────────────────────
  'SP 46': {
    qh1: [[0,14.0],[6,13.5],[12,13.0],[18,12.3],[24,11.5],[30,10.7],[36,10.0],[42,9.2],[46,8.8],[50,7.8],[54,6.5],[60,4.5]],
    eta: [[0,0],[6,36],[12,56],[18,67],[24,73],[30,76],[36,76],[42,76],[46,75],[54,72],[60,65]],
    Q_max:60.0
  },

  // ── SP 60 — Q_max réel 80 m³/h — 6" ─────────────────────────────
  'SP 60': {
    qh1: [[0,15.0],[8,14.5],[16,13.9],[24,13.2],[32,12.5],[40,11.7],[48,10.8],[56,9.8],[60,9.2],[64,8.5],[72,6.5],[80,4.0]],
    eta: [[0,0],[8,38],[16,58],[24,68],[32,74],[40,77],[48,78],[56,77],[60,77],[68,75],[78,68]],
    Q_max:80.0
  },

  // ── SP 77 — Q_max réel 95 m³/h — 8" ─────────────────────────────
  'SP 77': {
    qh1: [[0,20.0],[10,19.5],[20,18.8],[30,18.0],[40,17.0],[50,15.8],[60,14.4],[70,12.7],[77,11.5],[80,10.5],[85,8.0],[90,5.0]],
    eta: [[0,0],[10,38],[20,58],[35,70],[50,76],[65,78],[77,78],[85,76],[90,70]],
    Q_max:90.0
  },

  // ── SP 95 — Q_max réel 120 m³/h — 8" ────────────────────────────
  'SP 95': {
    qh1: [[0,22.0],[12,21.5],[24,20.8],[36,20.0],[48,19.0],[60,17.8],[72,16.3],[84,14.5],[95,12.5],[100,11.2],[108,8.5],[120,4.5]],
    eta: [[0,0],[12,38],[25,58],[45,70],[65,77],[85,80],[95,80],[108,77],[120,68]],
    Q_max:120.0
  },

  // ── SP 125 — Q_max réel 160 m³/h — 10" ──────────────────────────
  'SP 125': {
    qh1: [[0,29.7],[16,29.0],[32,27.9],[48,26.5],[64,25.0],[80,23.2],[96,21.0],[112,18.5],[125,16.5],[130,15.5],[140,13.0],[150,10.0],[160,7.0]],
    eta: [[0,0],[16,38],[32,58],[55,70],[80,77],[105,80],[125,80],[145,77],[160,68]],
    Q_max:160.0
  },

  // ── SP 160 — Q_max réel 210 m³/h — 10" ──────────────────────────
  'SP 160': {
    qh1: [[0,13.0],[20,12.8],[40,12.5],[60,12.0],[80,11.4],[100,10.7],[120,9.8],[140,8.8],[160,7.5],[175,6.2],[190,4.8],[210,3.0]],
    eta: [[0,0],[20,38],[40,58],[65,70],[90,77],[120,80],[145,81],[165,80],[190,76],[210,68]],
    Q_max:210.0
  },

  // ── SP 215 — Q_max réel 280 m³/h — 10" ──────────────────────────
  'SP 215': {
    qh1: [[0,17.0],[28,16.6],[56,16.0],[84,15.2],[112,14.2],[140,13.0],[168,11.7],[196,10.2],[215,9.0],[240,7.0],[260,5.0],[280,3.0]],
    eta: [[0,0],[28,38],[56,58],[90,70],[130,78],[175,82],[215,83],[250,80],[280,72]],
    Q_max:280.0
  },
};

// Courbes H par étage pour familles CR (lues sur graphiques databooklet)
const CR_STAGE_QH = {
  // CR 1 : Q_max 2.2 m³/h | Lu sur PDF p.32 : -2@Q0=13m->6.5m/st | -2@Q2.2≈7m->3.5m/st
  'CR 1': [[0,6.5],[0.2,6.4],[0.4,6.3],[0.6,6.1],[0.8,5.9],[1.0,5.6],[1.2,5.3],[1.4,4.9],[1.6,4.3],[1.8,3.6],[2.0,2.7],[2.2,1.6]],
  // CR 3 : Q_max 4.5 m³/h | Lu sur PDF p.36 : -2@Q0≈13m->6.5m/st | -2@Q3≈9m->4.5m/st | -2@Q4.5≈6m->3.0m/st
  'CR 3': [[0,6.5],[0.5,6.3],[1.0,6.1],[1.5,5.8],[2.0,5.5],[2.5,5.0],[3.0,4.5],[3.5,3.9],[4.0,3.2],[4.5,2.3]],
  // CR 5 : Q_max 8.5 m³/h | Lu sur PDF p.40 : -1@Q0≈9.6m | -3@Q5≈28m->9.3m/st | -3@Q8.5≈14m->4.7m/st
  'CR 5': [[0,9.6],[1,9.4],[2,9.2],[3,8.9],[4,8.5],[5,8.0],[6,7.3],[7,6.4],[7.5,5.8],[8,5.0],[8.5,3.9]],
  // CR 10 : Q_max 12 m³/h | Lu sur PDF p.44 : -1@Q0≈10.8m | -9@Q10≈86m->9.6m/st | -1@Q12≈4m->4.0m/st
  'CR 10': [[0,10.8],[1,10.7],[2,10.5],[3,10.3],[4,10.0],[5,9.7],[6,9.3],[7,8.8],[8,8.2],[9,7.4],[10,6.5],[11,5.2],[12,3.5]],
  // CR 15 : Q_max 22 m³/h | Lu sur PDF p.48 : -1@Q0≈16m | -17@Q15≈235m->13.8m/st | -1@Q22≈6m->6.0m/st
  'CR 15': [[0,16.0],[2,15.8],[4,15.5],[6,15.2],[8,14.8],[10,14.3],[12,13.8],[14,13.2],[15,12.8],[16,12.0],[18,10.5],[20,8.5],[22,6.0]],
  // CR 20 : Q_max 28 m³/h | Lu sur PDF p.52 : -1@Q0≈16m | -17@Q20≈251m->14.8m/st | -1@Q28≈7m->7.0m/st
  'CR 20': [[0,16.0],[3,15.6],[6,15.2],[9,14.6],[12,14.0],[15,13.2],[17,12.7],[20,11.8],[22,11.0],[24,9.8],[26,8.3],[28,6.5]],
  // CR 32 : Q_max 38 m³/h | Lu sur PDF p.56 : -1@Q0≈21m | -14@Q32≈262m->18.7m/st | -1@Q38≈9m->9.0m/st
  'CR 32': [[0,21.0],[4,20.5],[8,19.8],[12,19.0],[16,18.2],[20,17.2],[24,16.0],[28,14.6],[32,12.8],[34,11.5],[36,9.5],[38,7.0]],
  // CR 45 : Q_max 55 m³/h | Lu sur PDF p.60 : -1@Q0≈27m | -13@Q45≈322m->24.8m/st | -1@Q55≈12m->12.0m/st
  'CR 45': [[0,27.0],[5,26.4],[10,25.6],[15,24.8],[20,23.8],[25,22.6],[30,21.2],[35,19.6],[40,17.6],[45,15.2],[48,13.5],[52,10.5],[55,7.5]],
  // CR 64 : Q_max 80 m³/h | Lu sur PDF p.64 : -1@Q0≈31m | -8@Q64≈220m->27.5m/st | -1@Q80≈12m->12.0m/st
  'CR 64': [[0,31.0],[8,30.2],[16,29.3],[24,28.2],[32,26.8],[40,25.2],[48,23.3],[56,21.0],[64,18.2],[68,16.5],[72,14.0],[76,11.0],[80,7.5]],
  // CR 95 : Q_max 120 m³/h | Lu sur PDF p.68 : -3@Q0≈100m->33m/st | -3@Q95≈82m->27.3m/st | -3@Q120≈22m->7.3m/st
  'CR 95': [[0,33.0],[12,32.3],[24,31.3],[36,30.0],[48,28.5],[60,26.7],[72,24.5],[84,22.0],[95,19.2],[100,17.5],[108,14.0],[115,10.0],[120,7.0]],
  // CR 125 : Q_max 155 m³/h | Lu sur PDF p.72 : -5@Q0≈170m->34m/st | -5@Q125≈168m->33.6m/st | -5@Q155≈88m->17.6m/st
  'CR 125': [[0,36.0],[15,35.2],[30,34.0],[45,32.5],[60,30.8],[75,28.8],[90,26.5],[105,23.7],[120,20.5],[125,19.5],[130,18.0],[140,14.5],[150,10.5],[155,8.0]],
  // CR 155 : Q_max 180 m³/h | Extrapolé depuis CR 125 avec Q élargi
  'CR 155': [[0,11.0],[20,10.8],[40,10.4],[60,9.9],[80,9.3],[100,8.5],[120,7.6],[140,6.5],[155,5.5],[165,4.2],[180,2.5]],
  // CR 215 : Q_max 260 m³/h | Lu sur PDF
  'CR 215': [[0,13.5],[25,13.2],[50,12.7],[75,12.0],[100,11.2],[125,10.2],[150,9.0],[175,7.5],[200,6.0],[215,5.0],[230,3.8],[260,1.5]],
  // CR 255 : Q_max 295 m³/h
  'CR 255': [[0,10.5],[30,10.2],[60,9.8],[90,9.2],[120,8.5],[150,7.6],[180,6.6],[210,5.4],[240,4.0],[265,2.8],[295,1.0]],
};

// Courbes rendement CR (par famille)
const CR_ETA_CURVES = {
  'CR 1':  [[0,0],[0.3,15],[0.6,27],[0.9,36],[1.2,41],[1.5,42],[1.8,41],[2.0,38],[2.2,33]],
  'CR 3':  [[0,0],[0.5,18],[1.0,30],[1.5,40],[2.0,49],[2.5,53],[3.0,54],[3.5,52],[4.0,48],[4.5,42]],
  'CR 5':  [[0,0],[1,20],[2,35],[3,48],[4,57],[5,62],[6,64],[7,63],[8,59],[8.5,55]],
  'CR 10': [[0,0],[1.5,22],[3,38],[5,54],[7,63],[8,67],[9,68],[10,68],[11,65],[12,60]],
  'CR 15': [[0,0],[2,26],[5,48],[8,60],[10,67],[12,71],[14,72],[16,71],[18,69],[20,65],[22,58]],
  'CR 20': [[0,0],[3,26],[6,46],[9,58],[12,66],[15,71],[17,73],[20,73],[22,71],[25,68],[28,62]],
  'CR 32': [[0,0],[5,33],[10,52],[16,63],[22,70],[28,74],[32,76],[35,75],[38,70]],
  'CR 45': [[0,0],[7,36],[14,54],[22,64],[30,71],[38,76],[45,78],[50,77],[55,72]],
  'CR 64': [[0,0],[9,36],[18,54],[27,64],[36,71],[45,76],[54,78],[64,78],[72,75],[80,68]],
  'CR 95': [[0,0],[12,38],[25,58],[45,70],[65,77],[85,80],[95,80],[108,77],[120,68]],
  'CR 125':[[0,0],[15,38],[30,58],[55,70],[80,77],[105,80],[125,80],[140,77],[155,68]],
  'CR 155':[[0,0],[18,38],[36,58],[65,70],[95,78],[130,82],[155,82],[170,79],[180,72]],
  'CR 215':[[0,0],[30,38],[60,58],[100,70],[145,78],[185,82],[215,83],[240,80],[260,72]],
  'CR 255':[[0,0],[35,38],[70,58],[115,70],[165,78],[210,82],[250,83],[275,80],[295,72]],
};

// ══════════════════════════════════════════════════════════════════════
// COURBES DIRECTES PAR RÉFÉRENCE — Digitalisation pixel-précise validée
// Méthode : calibration axes (tick marks PDF 300dpi) + scan colonnes verticales
// + filtrage gridlines (fraction sombre largeur >0.65) + vérification par
// cohérence H/stage (variance <2% sur toutes les références d'une famille)
// Remplace le calcul "H/stage × n_stages" par la vraie courbe Q/H totale
// lue directement sur le graphique pour CHAQUE référence commerciale.
// ══════════════════════════════════════════════════════════════════════
const SP5A_DIRECT = {
  '4': [[0.0,25.0],[1.0,23.6],[1.5,22.9],[2.0,22.1],[2.5,21.4],[3.0,21.1],[3.5,19.1],[4.0,18.6],[4.5,17.5],[5.0,15.9],[5.5,13.9],[6.0,11.4]],
  '6': [[0.0,38.1],[1.0,35.7],[1.5,34.5],[2.0,33.2],[2.5,32.1],[3.0,31.3],[3.5,29.3],[4.0,28.2],[4.5,26.1],[5.0,23.8],[5.5,21.2],[6.0,17.5]],
  '8': [[0.0,50.3],[1.0,47.5],[1.5,46.1],[2.0,44.8],[2.5,43.2],[3.0,41.8],[3.5,40.7],[4.0,37.9],[4.5,35.4],[5.0,32.1],[5.5,28.2],[6.0,23.6]],
  '12': [[0.0,76.0],[1.0,71.2],[1.5,68.8],[2.0,66.8],[2.5,64.6],[3.0,62.3],[3.5,59.1],[4.0,56.4],[4.5,52.5],[5.0,47.9],[5.5,42.1],[6.0,35.0]],
  '17': [[0.0,107.1],[1.0,100.7],[1.5,97.5],[2.0,94.5],[2.5,91.4],[3.0,88.0],[3.5,84.3],[4.0,79.1],[4.5,73.9],[5.0,67.1],[5.5,58.8],[6.0,48.9]],
  '21': [[0.0,132.9],[1.0,125.5],[1.5,121.8],[2.0,118.2],[2.5,114.6],[3.0,110.9],[3.5,106.1],[4.0,100.5],[4.5,93.9],[5.0,85.4],[5.5,75.4],[6.0,63.4]],
  '25': [[0.0,157.6],[1.0,148.4],[1.5,143.8],[2.0,138.8],[2.5,135.0],[3.0,130.4],[3.5,124.6],[4.0,117.9],[4.5,109.6],[5.0,99.6],[5.5,87.5],[6.0,73.4]],
  '33': [[0.0,208.5],[1.0,195.7],[1.5,189.3],[2.0,183.6],[2.5,177.5],[3.0,171.1],[3.5,163.9],[4.0,155.0],[4.5,144.1],[5.0,130.9],[5.5,114.8],[6.0,96.1]],
  '38': [[0.0,247.9],[1.0,232.9],[1.5,225.4],[2.0,218.9],[2.5,212.1],[3.0,204.6],[3.5,196.1],[4.0,186.1],[4.5,173.2],[5.0,157.7],[5.5,138.4],[6.0,116.6]],
  '44': [[0.0,278.4],[1.0,261.4],[1.5,252.9],[2.0,245.4],[2.5,237.5],[3.0,228.8],[3.5,219.3],[4.0,207.5],[4.5,192.9],[5.0,175.4],[5.5,154.1],[6.0,128.9]],
  '52': [[0.0,330.5],[1.0,311.1],[1.5,301.4],[2.0,292.5],[2.5,283.9],[3.0,274.3],[3.5,262.9],[4.0,249.3],[4.5,232.3],[5.0,211.6],[5.5,186.6],[6.0,157.1]],
  '60': [[0.0,380.0],[1.0,357.0],[1.5,345.5],[2.0,335.0],[2.5,324.6],[3.0,313.2],[3.5,300.7],[4.0,283.9],[4.5,264.3],[5.0,240.9],[5.5,211.2],[6.0,176.8]],
  '75': [[0.0,474.1],[1.0,446.1],[1.5,432.1],[2.0,418.6],[2.5,406.1],[3.0,391.8],[3.5,375.2],[4.0,355.0],[4.5,330.9],[5.0,300.9],[5.5,264.1],[6.0,221.4]],
  '85': [[0.0,535.9],[1.0,502.9],[1.5,486.4],[2.0,471.3],[2.5,456.1],[3.0,438.8],[3.5,420.7],[4.0,397.3],[4.5,369.0],[5.0,335.0],[5.5,293.8],[6.0,245.0]],
};
const SP7_DIRECT = {
  '3': [[0.0,22.2],[1.0,22.2],[1.5,22.2],[3.5,21.2],[4.5,20.2],[5.0,19.6],[5.5,18.9],[6.5,17.1],[7.5,15.1],[8.5,12.2],[9.0,10.5]],
  '5': [[0.0,40.6],[1.0,38.0],[1.5,36.7],[3.5,35.2],[4.5,33.9],[5.0,32.9],[5.5,31.9],[6.5,28.8],[7.5,25.8],[8.5,20.7],[9.0,17.9]],
  '8': [[0.0,59.8],[1.0,59.2],[1.5,58.9],[3.5,56.6],[4.5,54.3],[5.0,52.8],[5.5,51.0],[6.5,46.4],[7.5,40.6],[8.5,32.9],[9.0,28.6]],
  '12': [[0.0,89.9],[1.0,88.5],[1.5,87.8],[3.5,83.9],[4.5,80.6],[5.0,78.3],[5.5,75.8],[6.5,68.9],[7.5,59.7],[8.5,47.7],[9.0,41.8]],
  '17': [[0.0,127.1],[1.0,125.5],[1.5,124.7],[3.5,119.6],[4.5,114.8],[5.0,112.0],[5.5,107.7],[6.5,99.0],[7.5,84.7],[8.5,69.4],[9.0,59.7]],
  '23': [[0.0,170.9],[1.0,169.9],[1.5,169.4],[3.5,162.5],[4.5,156.1],[5.0,151.8],[5.5,145.9],[6.5,133.2],[7.5,116.8],[8.5,94.9],[9.0,82.1]],
  '31': [[0.0,231.7],[1.0,229.3],[1.5,228.1],[3.5,218.6],[4.5,210.2],[5.0,204.8],[5.5,198.0],[6.5,180.1],[7.5,157.4],[8.5,128.1],[9.0,111.5]],
  '42': [[0.0,315.5],[1.0,312.5],[1.5,311.0],[3.5,299.2],[4.5,288.0],[5.0,280.1],[5.5,271.2],[6.5,248.0],[7.5,216.8],[8.5,177.3],[9.0,154.1]],
};
const SP2A_DIRECT = {
  '6': [[0.0,36.5],[0.3,35.1],[0.5,34.2],[0.7,32.9],[0.9,31.6],[1.1,29.0],[1.3,27.3],[1.5,24.3],[1.7,20.4],[1.9,15.3],[2.0,12.3]],
  '9': [[0.0,54.3],[0.3,51.8],[0.5,50.1],[0.7,48.4],[0.9,45.8],[1.1,42.8],[1.3,38.9],[1.5,34.6],[1.7,28.6],[1.9,21.1],[2.0,17.0]],
  '13': [[0.0,78.4],[0.3,75.1],[0.5,72.9],[0.7,69.2],[0.9,66.5],[1.1,62.6],[1.3,57.0],[1.5,50.5],[1.7,41.9],[1.9,31.4],[2.0,25.2]],
  '18': [[0.0,108.5],[0.3,104.3],[0.5,101.5],[0.7,97.4],[0.9,92.7],[1.1,86.7],[1.3,78.9],[1.5,70.1],[1.7,58.3],[1.9,43.4],[2.0,35.1]],
  '23': [[0.0,140.8],[0.3,134.0],[0.5,129.5],[0.7,125.4],[0.9,118.7],[1.1,111.6],[1.3,102.6],[1.5,90.5],[1.7,75.5],[1.9,56.8],[2.0,46.0]],
  '33': [[0.0,200.5],[0.3,191.8],[0.5,186.0],[0.7,178.7],[0.9,169.5],[1.1,159.1],[1.3,146.0],[1.5,128.8],[1.7,107.3],[1.9,81.3],[2.0,64.7]],
  '40': [[0.0,246.9],[0.3,237.6],[0.5,231.4],[0.7,222.2],[0.9,211.8],[1.1,198.5],[1.3,181.5],[1.5,159.4],[1.7,132.5],[1.9,98.3],[2.0,78.3]],
};
const SP3A_DIRECT = {
  '6': [[0.0,37.9],[0.3,36.0],[0.5,34.7],[0.9,31.9],[1.1,30.5],[1.3,28.2],[1.5,25.5],[1.7,21.8],[1.9,17.3]],
  '9': [[0.0,56.4],[0.3,54.0],[0.5,52.4],[0.9,48.4],[1.1,46.0],[1.3,42.7],[1.5,38.5],[1.7,33.1],[1.9,26.3]],
  '12': [[0.0,75.9],[0.3,72.7],[0.5,70.6],[0.9,65.0],[1.1,61.8],[1.3,57.3],[1.5,51.8],[1.7,44.5],[1.9,35.6]],
  '15': [[0.0,95.4],[0.3,91.1],[0.5,88.2],[0.9,81.9],[1.1,77.9],[1.3,72.4],[1.5,65.6],[1.7,56.6],[1.9,45.6]],
  '22': [[0.0,140.0],[0.3,133.4],[0.5,129.0],[0.9,119.2],[1.1,113.5],[1.3,105.6],[1.5,95.6],[1.7,82.1],[1.9,66.0]],
  '33': [[0.0,211.2],[0.3,201.0],[0.5,194.2],[0.9,179.7],[1.1,171.3],[1.3,159.0],[1.5,144.0],[1.7,124.0],[1.9,99.8]],
};
const SP9_DIRECT = {
  '4': [[0.0,25.1],[1.5,25.0],[3.5,24.8],[7.0,22.5],[9.0,18.5]],
  '5': [[0.0,32.2],[1.5,31.8],[3.5,31.2],[7.0,28.2],[9.0,24.8]],
  '8': [[0.0,51.4],[1.5,51.0],[3.5,50.5],[7.0,45.8],[9.0,40.5]],
  '10': [[0.0,64.2],[1.5,63.8],[3.5,63.2],[7.0,58.0],[9.0,51.0]],
  '13': [[0.0,83.5],[1.5,83.2],[3.5,82.8],[7.0,76.8],[9.0,67.2]],
  '18': [[0.0,116.0],[1.5,115.5],[3.5,114.8],[7.0,106.5],[9.0,93.2]],
  '25': [[0.0,161.5],[1.5,161.2],[3.5,160.8],[7.0,150.5],[9.0,131.2]],
};
const SP11_DIRECT = {
  '3': [[0.0,17.8],[1,17.5],[3,16.9],[4,16.8],[5,16.5],[6,16.2],[7,15.8],[8,15.4],[9,14.4],[10,14.0],[11,13.1],[12,12.2],[13,11.1],[14,10.2]],
  '5': [[0.0,29.8],[1,29.3],[3,28.3],[4,28.1],[5,27.6],[6,27.1],[7,26.5],[8,25.7],[9,24.4],[10,23.6],[11,22.3],[12,20.6],[13,18.8],[14,16.9]],
  '7': [[0.0,41.4],[1,40.8],[3,39.5],[4,39.2],[5,38.6],[6,38.1],[7,37.1],[8,36.0],[9,34.5],[10,33.1],[11,31.2],[12,29.0],[13,26.4],[14,23.6]],
  '11': [[0.0,65.0],[1,64.1],[3,62.3],[4,61.6],[5,60.8],[6,59.6],[7,58.4],[8,56.8],[9,54.5],[10,52.1],[11,49.2],[12,45.6],[13,41.8],[14,37.3]],
  '15': [[0.0,88.6],[1,87.6],[3,85.5],[4,84.4],[5,83.3],[6,81.9],[7,80.5],[8,77.9],[9,75.4],[10,71.6],[11,67.7],[12,62.9],[13,57.5],[14,51.6]],
  '20': [[0.0,118.4],[1,116.9],[3,113.9],[4,112.7],[5,111.3],[6,109.5],[7,107.3],[8,104.2],[9,100.6],[10,95.8],[11,90.6],[12,84.2],[13,77.0],[14,69.1]],
};
const SP14_DIRECT = {
  '4': [[0.0,20.5],[4,18.3],[6,17.2],[8,16.2],[10,14.9],[12,13.5],[14,11.4],[16,8.9],[17.5,6.5]],
  '6': [[0.0,32.9],[4,29.9],[6,28.4],[8,26.8],[10,25.0],[12,22.9],[14,19.9],[16,16.2],[17.5,12.7]],
  '8': [[0.0,45.7],[4,41.9],[6,40.0],[8,38.1],[10,35.5],[12,32.9],[14,29.1],[16,24.1],[17.5,19.5]],
  '11': [[0.0,64.8],[4,59.8],[6,57.3],[8,54.6],[10,51.7],[12,47.6],[14,42.4],[16,35.6],[17.5,29.7]],
  '15': [[0.0,90.4],[4,83.6],[6,80.2],[8,76.4],[10,72.3],[12,67.1],[14,60.1],[16,51.0],[17.5,42.8]],
  '20': [[0.0,123.2],[4,114.2],[6,109.7],[8,104.9],[10,99.3],[12,92.2],[14,83.4],[16,71.5],[17.5,60.6]],
};
const SP18_DIRECT = {
  '18': [[0.0,150.2],[2,150.6],[4,151.0],[6,148.7],[10,138.3],[12,131.0],[16,113.3],[18,102.1],[20,89.0]],
  '20': [[0.0,170.1],[2,171.0],[4,171.9],[6,169.4],[10,157.3],[12,149.4],[16,129.6],[18,117.1],[20,102.5]],
  '25': [[0.0,223.2],[2,224.0],[4,224.8],[6,221.5],[10,206.7],[12,196.3],[16,170.4],[18,155.0],[20,137.5]],
  '33': [[0.0,307.2],[2,308.1],[4,309.0],[6,304.0],[10,284.4],[12,270.6],[16,237.1],[18,217.3],[20,194.6]],
  '40': [[0.0,379.1],[2,381.0],[4,382.9],[6,376.9],[10,351.7],[12,336.0],[16,297.1],[18,272.3],[20,244.2]],
  '48': [[0.0,465.3],[2,465.8],[4,466.3],[6,459.8],[10,431.0],[12,411.5],[16,364.2],[18,335.6],[20,302.1]],
  '60': [[0.0,590.9],[2,592.1],[4,593.3],[6,584.0],[10,548.3],[12,523.9],[16,465.2],[18,429.0],[20,386.5]],
};
const SP46_DIRECT = {
  '2': [[0.0,19.3],[5,18.0],[8,17.2],[10,16.9],[12,16.5],[15,15.9],[18,14.7],[20,14.1],[22,12.9],[25,11.2],[28,9.2]],
  '4': [[0.0,49.8],[5,47.1],[8,45.5],[10,44.5],[12,43.2],[15,41.2],[18,39.0],[20,37.3],[22,35.3],[25,32.4],[28,28.8]],
  '7': [[0.0,95.7],[5,91.0],[8,88.2],[10,86.2],[12,83.5],[15,80.2],[18,76.2],[20,73.1],[22,70.2],[25,64.8],[28,58.5]],
};
const SP60_DIRECT = {
  '3': [[0.0,32.4],[10,31.0],[15,30.3],[20,28.9],[25,26.9],[30,24.6]],
  '5': [[0.0,61.4],[10,58.8],[15,57.5],[20,55.3],[25,52.2],[30,48.4]],
};
const SP32_DIRECT = {
  '20': [[0.0,219.5],[3,213.2],[4,211.1],[6,205.6],[14,177.7]],
  '25': [[0.0,275.3],[3,266.6],[4,263.7],[6,256.5],[14,222.3]],
  '33': [[0.0,363.9],[3,352.5],[4,348.7],[6,338.6],[14,293.9]],
};
const SP77_DIRECT = {
  '3': [[0.0,43.6],[8,42.6],[15,41.7],[50,30.6],[55,28.8],[60,27.0],[65,25.2],[70,23.3],[75,21.0],[80,18.6]],
  '5': [[0.0,92.1],[8,90.5],[15,89.1],[50,68.5],[55,65.3],[60,62.2],[65,59.1],[70,56.0],[75,52.6],[80,48.5]],
};
const SP95_DIRECT = {
  '3': [[0.0,50.7],[20,45.5],[30,42.9],[40,39.7],[50,37.1],[60,34.4],[80,28.4]],
  '5': [[0.0,97.9],[20,88.9],[30,84.4],[40,78.8],[50,73.4],[60,68.6],[80,58.8]],
};
const SP125_DIRECT = {
  '3': [[0.0,65.8],[40,57.4],[60,53.2],[80,48.6],[100,43.4],[120,36.3]],
  '5': [[0.0,130.4],[40,116.4],[60,109.4],[80,101.5],[100,93.1],[120,82.0]],
};
// Table de lookup : famille -> { nb_étages: courbe directe }
const DIRECT_CURVES_BY_FAMILY = {
  'SP 5A': SP5A_DIRECT,
  'SP 7': SP7_DIRECT,
  'SP 2A': SP2A_DIRECT,
  'SP 3A': SP3A_DIRECT,
  'SP 9': SP9_DIRECT,
  'SP 11': SP11_DIRECT,
  'SP 14': SP14_DIRECT,
  'SP 18': SP18_DIRECT,
  'SP 46': SP46_DIRECT,
  'SP 60': SP60_DIRECT,
  'SP 32': SP32_DIRECT,
  'SP 77': SP77_DIRECT,
  'SP 95': SP95_DIRECT,
  'SP 125': SP125_DIRECT,
};

// ── Fonctions calcul courbe ───────────────────────────────────────────
const CR3_DIRECT = {
  '2': [[0.0,13.5],[0.6,12.9],[0.7,12.8],[0.9,12.6],[1.1,12.4],[1.3,12.2],[1.6,11.8],[1.9,11.2],[2.2,10.4],[2.5,9.4],[2.9,7.9]],
  '3': [[0.0,20.2],[0.6,19.4],[0.9,19.0],[1.1,18.7],[1.4,18.1],[1.7,17.3],[2.0,16.3],[2.2,15.6],[2.5,14.1],[2.9,11.7]],
  '4': [[0.0,27.1],[0.6,25.9],[0.9,25.3],[1.1,24.9],[1.4,24.1],[1.7,23.1],[2.0,21.9],[2.2,20.7],[2.5,18.7],[2.9,15.0]],
  '6': [[0.0,40.9],[0.6,38.1],[0.9,36.7],[1.1,36.0],[1.4,34.7],[1.7,33.1],[2.0,30.7],[2.2,28.7],[2.5,25.0],[2.9,21.9]],
  '8': [[0.0,54.5],[0.6,50.7],[0.9,48.8],[1.1,47.9],[1.4,46.2],[1.7,43.7],[2.0,40.6],[2.2,37.2],[2.5,32.4],[2.9,27.4]],
  '12': [[0.0,81.9],[0.6,76.9],[0.9,74.4],[1.1,72.8],[1.4,70.0],[1.7,65.9],[2.0,60.8],[2.2,56.7],[2.5,49.1],[2.9,39.2]],
  '17': [[0.0,115.6],[0.6,109.4],[0.9,106.3],[1.1,104.1],[1.4,99.4],[1.7,94.1],[2.0,87.0],[2.2,80.8],[2.5,70.2],[2.9,59.7]],
  '23': [[0.0,155.5],[0.6,148.1],[0.9,144.4],[1.1,141.4],[1.4,135.7],[1.7,128.3],[2.0,118.1],[2.2,110.2],[2.5,96.5],[2.9,80.6]],
};
const CR5_DIRECT = {
  '2': [[0.0,13.9],[0.1,13.9],[0.5,13.8],[1.4,13.6],[2.1,13.4],[4.4,13.1],[5.0,12.8],[6.0,12.5],[7.0,12.3],[8.0,11.9],[8.5,11.8]],
  '3': [[0.0,20.8],[0.1,20.8],[0.5,20.7],[1.4,20.5],[2.1,20.4],[4.4,19.4],[5.0,19.0],[6.0,18.8],[7.0,18.5],[8.0,18.1],[8.5,17.8]],
  '4': [[0.0,27.9],[0.1,27.8],[0.5,27.6],[1.4,27.2],[2.1,27.0],[4.4,26.2],[5.0,25.6],[6.0,25.2],[7.0,24.8],[8.0,24.2],[8.5,23.8]],
  '5': [[0.0,34.4],[0.1,34.4],[0.5,34.2],[1.4,33.8],[2.1,33.4],[4.4,32.4],[5.0,31.6],[6.0,31.1],[7.0,30.6],[8.0,29.8],[8.5,29.4]],
  '7': [[0.0,48.6],[0.1,48.5],[0.5,48.2],[1.4,47.5],[2.1,47.1],[4.4,45.7],[5.0,44.9],[6.0,44.0],[7.0,43.3],[8.0,42.3],[8.5,41.8]],
  '10': [[0.0,69.7],[0.1,69.6],[0.5,69.2],[1.4,68.2],[2.1,67.5],[4.4,65.8],[5.0,64.6],[6.0,63.6],[7.0,62.4],[8.0,61.1],[8.5,60.4]],
  '13': [[0.0,91.0],[0.1,90.8],[0.5,90.1],[1.4,88.9],[2.1,88.3],[4.4,86.0],[5.0,84.8],[6.0,83.5],[7.0,82.0],[8.0,80.2],[8.5,79.2]],
  '18': [[0.0,125.8],[0.1,125.5],[0.5,124.5],[1.4,122.6],[2.1,121.5],[4.4,118.4],[5.0,117.0],[6.0,115.2],[7.0,113.0],[8.0,110.2],[8.5,108.8]],
  '24': [[0.0,168.5],[0.1,168.2],[0.5,167.0],[1.4,164.5],[2.1,162.8],[4.4,158.6],[5.0,157.4],[6.0,155.2],[7.0,152.2],[8.0,148.8],[8.5,147.0]],
};
const CR10_DIRECT = {
  '1': [[0.0,10.1],[4.8,9.5],[5.6,9.4],[6.7,9.0],[7.5,8.6],[8.3,8.1],[9.3,7.4],[10.1,6.8],[10.9,6.1],[11.9,5.1],[12.7,4.4]],
  '2': [[0.0,20.6],[4.8,19.4],[5.6,19.2],[6.7,18.7],[7.5,18.0],[8.3,17.1],[9.3,15.9],[10.1,14.8],[10.9,13.6],[11.9,11.8],[12.7,10.4]],
  '3': [[0.0,31.3],[4.8,29.5],[5.6,29.2],[6.7,28.2],[7.5,27.4],[8.3,26.4],[9.3,24.9],[10.1,23.5],[10.9,21.9],[11.9,19.4],[12.7,17.8]],
  '5': [[0.0,54.8],[4.8,51.2],[5.6,50.6],[6.7,49.4],[7.5,47.8],[8.3,46.1],[9.3,43.2],[10.1,40.7],[10.9,37.8],[11.9,33.9],[12.7,30.4]],
  '7': [[0.0,76.3],[4.8,72.1],[5.6,71.4],[6.7,69.4],[7.5,67.5],[8.3,65.0],[9.3,61.2],[10.1,57.6],[10.9,53.6],[11.9,48.1],[12.7,43.3]],
  '9': [[0.0,98.8],[4.8,92.8],[5.6,91.8],[6.7,89.3],[7.5,86.9],[8.3,83.6],[9.3,78.8],[10.1,74.3],[10.9,69.1],[11.9,62.0],[12.7,55.9]],
  '12': [[0.0,132.1],[4.8,124.9],[5.6,123.7],[6.7,120.6],[7.5,117.4],[8.3,113.1],[9.3,106.7],[10.1,100.6],[10.9,93.9],[11.9,84.5],[12.7,76.5]],
  '15': [[0.0,172.0],[5.0,155.0],[7.0,148.2],[9.0,134.8],[12.5,97.2]],
};
const CR15_DIRECT = {
  '1': [[0.1,13.3],[2.6,12.9],[5.2,12.4],[6.7,12.1],[8.2,11.9],[9.7,11.7],[11.5,11.2],[13.1,10.8],[14.8,10.3],[16.4,9.6],[18.1,9.0],[20.3,7.8],[21.8,6.8],[23.4,5.6]],
  '2': [[0.1,28.4],[2.6,27.7],[5.2,27.3],[6.7,26.9],[8.2,26.6],[9.7,26.2],[11.5,25.5],[13.1,24.6],[14.8,23.7],[16.4,22.6],[18.1,21.2],[20.3,19.0],[21.8,17.4],[23.4,15.5]],
  '3': [[0.1,42.4],[2.6,41.6],[5.2,41.0],[6.7,40.6],[8.2,40.3],[9.7,39.2],[11.5,38.4],[13.1,37.2],[14.8,35.7],[16.4,34.2],[18.1,31.9],[20.3,28.9],[21.8,26.4],[23.4,23.6]],
  '5': [[0.1,70.6],[2.6,69.5],[5.2,68.8],[6.7,68.3],[8.2,67.6],[9.7,66.7],[11.5,65.1],[13.1,63.1],[14.8,60.7],[16.4,57.9],[18.1,54.4],[20.3,49.1],[21.8,45.0],[23.4,40.6]],
  '7': [[0.1,99.0],[2.6,97.6],[5.2,96.8],[6.7,96.2],[8.2,95.1],[9.7,93.9],[11.5,91.7],[13.1,88.9],[14.8,85.5],[16.4,81.6],[18.1,76.6],[20.3,69.3],[21.8,63.5],[23.4,57.0]],
  '10': [[0.1,141.7],[2.6,140.1],[5.2,139.3],[6.7,138.6],[8.2,137.4],[9.7,135.6],[11.5,132.6],[13.1,128.8],[14.8,123.8],[16.4,118.1],[18.1,111.1],[20.3,100.6],[21.8,92.7],[23.4,83.5]],
};
const CR20_DIRECT = {
  '1': [[0.1,13.9],[1.6,14.0],[3.9,14.0],[5.4,13.9],[6.9,13.8],[8.4,13.5],[9.9,13.3],[11.7,12.9],[13.2,12.6],[14.7,12.2],[16.2,11.8],[17.8,11.2],[19.3,10.6],[20.8,10.0],[22.4,9.2],[24.4,8.2],[26.0,7.1],[27.6,6.1]],
  '2': [[0.1,28.9],[1.6,28.8],[3.9,28.6],[5.4,28.4],[6.9,28.2],[8.4,27.9],[9.9,27.6],[11.7,27.1],[13.2,26.6],[14.7,26.0],[16.2,25.3],[17.8,24.3],[19.3,23.3],[20.8,22.1],[22.4,20.9],[24.4,18.7],[26.0,17.0],[27.6,15.0]],
  '3': [[0.1,43.9],[1.6,43.7],[3.9,43.5],[5.4,43.3],[6.9,43.1],[8.4,42.9],[9.9,42.6],[11.7,42.0],[13.2,41.2],[14.7,40.5],[16.2,39.1],[17.8,38.1],[19.3,36.7],[20.8,35.0],[22.4,33.0],[24.4,30.0],[26.0,27.6],[27.6,24.6]],
  '5': [[0.1,73.5],[1.6,73.2],[3.9,72.8],[5.4,72.6],[6.9,72.4],[8.4,72.0],[9.9,71.4],[11.7,70.5],[13.2,69.4],[14.7,68.1],[16.2,66.5],[17.8,64.4],[19.3,62.0],[20.8,59.2],[22.4,56.1],[24.4,51.3],[26.0,47.0],[27.6,42.6]],
  '7': [[0.1,103.9],[1.6,103.2],[3.9,102.5],[5.4,102.1],[6.9,101.7],[8.4,101.1],[9.9,100.5],[11.7,99.1],[13.2,97.5],[14.7,95.7],[16.2,93.5],[17.8,90.6],[19.3,87.3],[20.8,83.6],[22.4,78.9],[24.4,72.4],[26.0,66.6],[27.6,60.2]],
  '10': [[0.1,148.5],[1.6,148.1],[3.9,147.5],[5.4,147.2],[6.9,146.7],[8.4,145.9],[9.9,144.8],[11.7,143.1],[13.2,141.0],[14.7,138.6],[16.2,135.3],[17.8,131.2],[19.3,126.6],[20.8,121.6],[22.4,115.2],[24.4,105.9],[26.0,97.5],[27.6,88.5]],
};
const CR32_DIRECT = {
  '2': [[15.0,17.9],[17.0,17.1],[19.0,16.3],[21.2,15.3],[23.5,14.3],[25.7,13.0],[28.0,11.6],[30.1,10.1]],
  '3': [[15.0,37.0],[17.0,35.9],[19.0,34.6],[21.2,33.2],[23.5,31.5],[25.7,29.8],[28.0,27.5],[30.1,25.4]],
  '5': [[15.0,76.3],[17.0,74.5],[19.0,72.6],[21.2,70.1],[23.5,67.4],[25.7,64.5],[28.0,61.1],[30.1,57.4]],
  '7': [[15.0,113.9],[17.0,111.3],[19.0,108.5],[21.2,104.9],[23.5,101.0],[25.7,96.7],[28.0,91.7],[30.1,86.6]],
  '10': [[15.0,172.3],[17.0,168.9],[19.0,165.1],[21.2,160.6],[23.5,155.0],[25.7,149.0],[28.0,141.9],[30.1,134.6]],
};
const CR45_DIRECT = {
  '2': [[22.0,49.9],[24.5,49.2],[29.8,47.3],[32.4,46.3],[35.6,44.9],[38.1,43.6],[41.1,41.9],[43.8,40.8]],
  '3': [[22.0,76.1],[24.5,74.9],[29.8,72.4],[32.4,70.9],[35.6,68.8],[38.1,67.1],[41.1,64.7],[43.8,62.4]],
  '5': [[22.0,127.0],[24.5,125.4],[29.8,121.2],[32.4,118.6],[35.6,115.3],[38.1,112.4],[41.1,108.4],[43.8,104.8]],
  '7': [[22.0,179.4],[24.5,177.2],[29.8,171.3],[32.4,168.0],[35.6,163.3],[38.1,159.0],[41.1,153.9],[43.8,148.5]],
};
const CR64_DIRECT = {
  '2': [[31.2,56.4],[35.6,55.3],[39.6,54.2],[43.6,52.9],[47.6,51.7],[51.9,50.3],[56.2,48.8],[60.2,47.3],[64.3,45.8]],
  '3': [[31.2,85.0],[35.6,83.4],[39.6,81.9],[43.6,80.2],[47.6,78.3],[51.9,76.1],[56.2,73.9],[60.2,71.7],[64.3,69.2]],
  '4': [[31.2,113.0],[35.6,111.0],[39.6,109.0],[43.6,106.9],[47.6,104.5],[51.9,101.7],[56.2,98.9],[60.2,96.0],[64.3,92.7]],
  '6': [[31.2,171.0],[35.6,168.0],[39.6,165.0],[43.6,161.8],[47.6,158.3],[51.9,154.4],[56.2,150.1],[60.2,146.0],[64.3,141.3]],
};
const DIRECT_CURVES_BY_FAMILY_CR = {
  'CR 3': CR3_DIRECT,
  'CR 5': CR5_DIRECT,
  'CR 10': CR10_DIRECT,
  'CR 15': CR15_DIRECT,
  'CR 20': CR20_DIRECT,
  'CR 32': CR32_DIRECT,
  'CR 45': CR45_DIRECT,
  'CR 64': CR64_DIRECT,
};

const getPumpCurveQH = (pump) => {
  const n = pump.stages;
  // Priorité 1 : courbe directe digitalisée pour cette référence exacte (la plus précise)
  if (pump.serie === 'SP') {
    const directFam = DIRECT_CURVES_BY_FAMILY[pump.sp_family];
    if (directFam && directFam[String(n)]) {
      return directFam[String(n)];
    }
  } else {
    const directFamCR = DIRECT_CURVES_BY_FAMILY_CR[pump.cr_family];
    if (directFamCR && directFamCR[String(n)]) {
      return directFamCR[String(n)];
    }
  }
  // Priorité 2 : calcul H/stage × n (approximation pour familles non encore digitalisées)
  if (pump.serie === 'SP') {
    const sc = SP_STAGE_CURVES[pump.sp_family];
    if (!sc) return null;
    return sc.qh1.map(([q,h]) => [q, parseFloat((h*n).toFixed(2))]);
  } else {
    const sc = CR_STAGE_QH[pump.cr_family];
    if (!sc) return null;
    return sc.map(([q,h]) => [q, parseFloat((h*n).toFixed(2))]);
  }
};

const getPumpEtaCurve = (pump) => {
  if (pump.serie === 'SP') {
    const sc = SP_STAGE_CURVES[pump.sp_family];
    return sc ? sc.eta : null;
  }
  return CR_ETA_CURVES[pump.cr_family] || null;
};

const getPumpAtQ = (pump, Q_target) => {
  const qh = getPumpCurveQH(pump);
  const eta_curve = getPumpEtaCurve(pump);
  if (!qh || qh.length === 0) return null;
  const Q_max_curve = qh[qh.length-1][0];
  // Q doit être dans la plage de la pompe
  if (Q_target > Q_max_curve) return null;
  const H = interpolate(qh, Q_target);
  if (H === null || H <= 0) return null;
  const eta = eta_curve ? (interpolate(eta_curve, Q_target) || 0) : 0;
  const Ph = (Q_target * 9.81 * 1000 * H) / 3600000;
  const Pa = eta > 0 ? Ph / (eta/100) : Ph * 2;
  return {
    H: parseFloat(H.toFixed(2)),
    eta: parseFloat(eta.toFixed(1)),
    Ph: parseFloat(Ph.toFixed(3)),
    Pa: parseFloat(Pa.toFixed(2)),
    Q_max_curve
  };
};

// ── BASE DE DONNÉES — avec sp_family et cr_family corrects ───────────
const PUMP_DB = [
  // ════════════════════════════════════════════════════════
  // GRUNDFOS CR — Multicellulaire verticale en ligne
  // cr_family correspond au Q_nom de la famille
  // ════════════════════════════════════════════════════════

  // ── CR 1 : Q_nom=1 m³/h ──────────────────────────────
  { brand:'Grundfos', serie:'CR', cr_family:'CR 1', model:'CR 1-2',  stages:2,  P_kw:0.37, IP:55, conn:'G 1/2',        pn:16, DN_mm:25,  temp_max:120, code:'92900962', prix_ht:1395, app:'Domestique,surpression légère,château eau' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 1', model:'CR 1-3',  stages:3,  P_kw:0.37, IP:55, conn:'G 1/2',        pn:16, DN_mm:25,  temp_max:120, code:'92900963', prix_ht:1446, app:'Domestique,surpression' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 1', model:'CR 1-4',  stages:4,  P_kw:0.37, IP:55, conn:'G 1/2',        pn:16, DN_mm:25,  temp_max:120, code:'92900965', prix_ht:1497, app:'Domestique,surpression' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 1', model:'CR 1-5',  stages:5,  P_kw:0.37, IP:55, conn:'G 1/2',        pn:16, DN_mm:25,  temp_max:120, code:'92900969', prix_ht:1547, app:'Domestique,surpression' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 1', model:'CR 1-6',  stages:6,  P_kw:0.37, IP:55, conn:'G 1/2',        pn:16, DN_mm:25,  temp_max:120, code:'92900970', prix_ht:1598, app:'Surpression,irrigation' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 1', model:'CR 1-8',  stages:8,  P_kw:0.55, IP:55, conn:'G 1/2',        pn:16, DN_mm:25,  temp_max:120, code:'92900974', prix_ht:1724, app:'Surpression,irrigation' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 1', model:'CR 1-10', stages:10, P_kw:0.55, IP:55, conn:'G 1/2',        pn:16, DN_mm:25,  temp_max:120, code:'92900978', prix_ht:1837, app:'Surpression,industrie' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 1', model:'CR 1-13', stages:13, P_kw:0.75, IP:55, conn:'G 1/2',        pn:16, DN_mm:25,  temp_max:120, code:'92900983', prix_ht:2162, app:'Surpression,industrie' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 1', model:'CR 1-15', stages:15, P_kw:0.75, IP:55, conn:'G 1/2',        pn:25, DN_mm:25,  temp_max:120, code:'92900986', prix_ht:2319, app:'Industrie,HTB' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 1', model:'CR 1-19', stages:19, P_kw:1.1,  IP:55, conn:'G 1/2',        pn:25, DN_mm:25,  temp_max:120, code:'92901383', prix_ht:2755, app:'Industrie,HTB' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 1', model:'CR 1-25', stages:25, P_kw:1.5,  IP:55, conn:'G 1/2',        pn:25, DN_mm:25,  temp_max:120, code:'92901384', prix_ht:2913, app:'Industrie,HTB' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 1', model:'CR 1-30', stages:30, P_kw:1.5,  IP:55, conn:'G 1/2',        pn:25, DN_mm:25,  temp_max:120, code:'92901385', prix_ht:3076, app:'Industrie,HTB' },

  // ── CR 3 : Q_nom=3 m³/h ──────────────────────────────
  { brand:'Grundfos', serie:'CR', cr_family:'CR 3', model:'CR 3-2',  stages:2,  P_kw:0.37, IP:55, conn:'G 1',          pn:16, DN_mm:32,  temp_max:120, code:'96509003', prix_ht:1480, app:'Domestique,HVAC,irrigation' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 3', model:'CR 3-3',  stages:3,  P_kw:0.37, IP:55, conn:'G 1',          pn:16, DN_mm:32,  temp_max:120, code:'96509004', prix_ht:1535, app:'Irrigation,HVAC' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 3', model:'CR 3-4',  stages:4,  P_kw:0.55, IP:55, conn:'G 1',          pn:16, DN_mm:32,  temp_max:120, code:'96509005', prix_ht:1645, app:'Irrigation,surpression' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 3', model:'CR 3-6',  stages:6,  P_kw:0.75, IP:55, conn:'G 1',          pn:16, DN_mm:32,  temp_max:120, code:'96509006', prix_ht:1820, app:'Surpression,industrie' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 3', model:'CR 3-8',  stages:8,  P_kw:1.1,  IP:55, conn:'G 1',          pn:16, DN_mm:32,  temp_max:120, code:'96509007', prix_ht:2020, app:'Surpression,industrie' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 3', model:'CR 3-12', stages:12, P_kw:1.5,  IP:55, conn:'G 1',          pn:25, DN_mm:32,  temp_max:120, code:'96509012', prix_ht:2350, app:'Industrie' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 3', model:'CR 3-17', stages:17, P_kw:2.2,  IP:55, conn:'G 1',          pn:25, DN_mm:32,  temp_max:120, code:'96509017', prix_ht:2920, app:'Industrie,HTB' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 3', model:'CR 3-23', stages:23, P_kw:3.0,  IP:55, conn:'G 1',          pn:25, DN_mm:32,  temp_max:120, code:'96509023', prix_ht:3480, app:'Industrie,HTB' },

  // ── CR 5 : Q_nom=5 m³/h ──────────────────────────────
  { brand:'Grundfos', serie:'CR', cr_family:'CR 5', model:'CR 5-2',  stages:2,  P_kw:0.37, IP:55, conn:'G 1 1/4',      pn:16, DN_mm:40,  temp_max:120, code:'96513002', prix_ht:1580, app:'Industrie,HVAC' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 5', model:'CR 5-3',  stages:3,  P_kw:0.55, IP:55, conn:'G 1 1/4',      pn:16, DN_mm:40,  temp_max:120, code:'96513003', prix_ht:1680, app:'Industrie,HVAC,irrigation' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 5', model:'CR 5-4',  stages:4,  P_kw:0.75, IP:55, conn:'G 1 1/4',      pn:16, DN_mm:40,  temp_max:120, code:'96513004', prix_ht:1780, app:'Industrie,surpression' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 5', model:'CR 5-5',  stages:5,  P_kw:0.75, IP:55, conn:'G 1 1/4',      pn:16, DN_mm:40,  temp_max:120, code:'96513005', prix_ht:1880, app:'Industrie,HVAC' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 5', model:'CR 5-7',  stages:7,  P_kw:1.1,  IP:55, conn:'G 1 1/4',      pn:16, DN_mm:40,  temp_max:120, code:'96513007', prix_ht:2080, app:'Industrie,surpression' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 5', model:'CR 5-10', stages:10, P_kw:1.5,  IP:55, conn:'G 1 1/4',      pn:16, DN_mm:40,  temp_max:120, code:'96513010', prix_ht:2280, app:'Industrie,surpression' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 5', model:'CR 5-13', stages:13, P_kw:2.2,  IP:55, conn:'G 1 1/4',      pn:25, DN_mm:40,  temp_max:120, code:'96513013', prix_ht:2680, app:'Industrie,HTB' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 5', model:'CR 5-18', stages:18, P_kw:3.0,  IP:55, conn:'G 1 1/4',      pn:25, DN_mm:40,  temp_max:120, code:'96513018', prix_ht:3280, app:'Industrie,HTB' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 5', model:'CR 5-24', stages:24, P_kw:4.0,  IP:55, conn:'G 1 1/4',      pn:25, DN_mm:40,  temp_max:120, code:'96513024', prix_ht:4200, app:'Industrie,HTB' },

  // ── CR 10 : Q_nom=10 m³/h ────────────────────────────
  { brand:'Grundfos', serie:'CR', cr_family:'CR 10', model:'CR 10-1', stages:1,  P_kw:0.75, IP:55, conn:'DN 50 flange',  pn:16, DN_mm:50,  temp_max:120, code:'96517001', prix_ht:2180, app:'Industrie,bâtiment' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 10', model:'CR 10-2', stages:2,  P_kw:1.1,  IP:55, conn:'DN 50 flange',  pn:16, DN_mm:50,  temp_max:120, code:'96517002', prix_ht:2480, app:'Industrie,bâtiment' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 10', model:'CR 10-3', stages:3,  P_kw:1.5,  IP:55, conn:'DN 50 flange',  pn:16, DN_mm:50,  temp_max:120, code:'96517003', prix_ht:2650, app:'Industrie,bâtiment,HVAC' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 10', model:'CR 10-5', stages:5,  P_kw:2.2,  IP:55, conn:'DN 50 flange',  pn:16, DN_mm:50,  temp_max:120, code:'96517005', prix_ht:3140, app:'Industrie,surpression' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 10', model:'CR 10-7', stages:7,  P_kw:3.0,  IP:55, conn:'DN 50 flange',  pn:16, DN_mm:50,  temp_max:120, code:'96517007', prix_ht:3780, app:'Industrie,HTB' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 10', model:'CR 10-9', stages:9,  P_kw:4.0,  IP:55, conn:'DN 50 flange',  pn:16, DN_mm:50,  temp_max:120, code:'96517009', prix_ht:4280, app:'Industrie,HTB' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 10', model:'CR 10-12',stages:12, P_kw:5.5,  IP:55, conn:'DN 50 flange',  pn:25, DN_mm:50,  temp_max:120, code:'96517012', prix_ht:5100, app:'Industrie,HTB' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 10', model:'CR 10-15',stages:15, P_kw:7.5,  IP:55, conn:'DN 50 flange',  pn:25, DN_mm:50,  temp_max:120, code:'96517015', prix_ht:6200, app:'Industrie,HTB' },

  // ── CR 15 : Q_nom=15 m³/h ────────────────────────────
  { brand:'Grundfos', serie:'CR', cr_family:'CR 15', model:'CR 15-1', stages:1,  P_kw:0.75, IP:55, conn:'DN 65 flange',  pn:16, DN_mm:65,  temp_max:120, code:'96520001', prix_ht:2800, app:'Industrie,bâtiment' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 15', model:'CR 15-2', stages:2,  P_kw:1.5,  IP:55, conn:'DN 65 flange',  pn:16, DN_mm:65,  temp_max:120, code:'96520002', prix_ht:3200, app:'Industrie,bâtiment,HVAC' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 15', model:'CR 15-3', stages:3,  P_kw:2.2,  IP:55, conn:'DN 65 flange',  pn:16, DN_mm:65,  temp_max:120, code:'96520003', prix_ht:3700, app:'Industrie,surpression' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 15', model:'CR 15-5', stages:5,  P_kw:3.0,  IP:55, conn:'DN 65 flange',  pn:16, DN_mm:65,  temp_max:120, code:'96520005', prix_ht:4600, app:'Industrie,surpression' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 15', model:'CR 15-7', stages:7,  P_kw:5.5,  IP:55, conn:'DN 65 flange',  pn:16, DN_mm:65,  temp_max:120, code:'96520007', prix_ht:5500, app:'Industrie,HTB' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 15', model:'CR 15-10',stages:10, P_kw:7.5,  IP:55, conn:'DN 65 flange',  pn:25, DN_mm:65,  temp_max:120, code:'96520010', prix_ht:7200, app:'Industrie,HTB' },

  // ── CR 20 : Q_nom=20 m³/h ────────────────────────────
  { brand:'Grundfos', serie:'CR', cr_family:'CR 20', model:'CR 20-2', stages:2,  P_kw:2.2,  IP:55, conn:'DN 80 flange',  pn:16, DN_mm:80,  temp_max:120, code:'96524002', prix_ht:4200, app:'Industrie,bâtiment,HVAC' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 20', model:'CR 20-3', stages:3,  P_kw:3.0,  IP:55, conn:'DN 80 flange',  pn:16, DN_mm:80,  temp_max:120, code:'96524003', prix_ht:4900, app:'Industrie,bâtiment' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 20', model:'CR 20-5', stages:5,  P_kw:5.5,  IP:55, conn:'DN 80 flange',  pn:16, DN_mm:80,  temp_max:120, code:'96524005', prix_ht:6100, app:'Industrie,surpression' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 20', model:'CR 20-7', stages:7,  P_kw:7.5,  IP:55, conn:'DN 80 flange',  pn:16, DN_mm:80,  temp_max:120, code:'96524007', prix_ht:7400, app:'Industrie,HTB' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 20', model:'CR 20-10',stages:10, P_kw:11.0, IP:55, conn:'DN 80 flange',  pn:25, DN_mm:80,  temp_max:120, code:'96524010', prix_ht:9800, app:'Industrie,HTB' },

  // ── CR 32 : Q_nom=32 m³/h ────────────────────────────
  { brand:'Grundfos', serie:'CR', cr_family:'CR 32', model:'CR 32-2', stages:2,  P_kw:3.0,  IP:55, conn:'DN 100 flange', pn:16, DN_mm:100, temp_max:120, code:'96530002', prix_ht:6200, app:'Industrie,collectivités' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 32', model:'CR 32-3', stages:3,  P_kw:4.0,  IP:55, conn:'DN 100 flange', pn:16, DN_mm:100, temp_max:120, code:'96530003', prix_ht:7200, app:'Industrie,collectivités' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 32', model:'CR 32-5', stages:5,  P_kw:5.5,  IP:55, conn:'DN 100 flange', pn:16, DN_mm:100, temp_max:120, code:'96530005', prix_ht:8800, app:'Industrie,collectivités' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 32', model:'CR 32-7', stages:7,  P_kw:7.5,  IP:55, conn:'DN 100 flange', pn:16, DN_mm:100, temp_max:120, code:'96530007', prix_ht:10500,app:'Industrie,collectivités' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 32', model:'CR 32-10',stages:10, P_kw:11.0, IP:55, conn:'DN 100 flange', pn:25, DN_mm:100, temp_max:120, code:'96530010', prix_ht:13500,app:'Industrie,HTB' },

  // ── CR 45 : Q_nom=45 m³/h ────────────────────────────
  { brand:'Grundfos', serie:'CR', cr_family:'CR 45', model:'CR 45-2', stages:2,  P_kw:5.5,  IP:55, conn:'DN 100 flange', pn:16, DN_mm:100, temp_max:120, code:'96536002', prix_ht:8400, app:'Industrie,collectivités' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 45', model:'CR 45-3', stages:3,  P_kw:7.5,  IP:55, conn:'DN 100 flange', pn:16, DN_mm:100, temp_max:120, code:'96536003', prix_ht:10200,app:'Industrie,collectivités' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 45', model:'CR 45-5', stages:5,  P_kw:11.0, IP:55, conn:'DN 100 flange', pn:16, DN_mm:100, temp_max:120, code:'96536005', prix_ht:12800,app:'Industrie,collectivités' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 45', model:'CR 45-7', stages:7,  P_kw:15.0, IP:55, conn:'DN 100 flange', pn:25, DN_mm:100, temp_max:120, code:'96536007', prix_ht:15400,app:'Industrie,HTB' },

  // ── CR 64 : Q_nom=64 m³/h ────────────────────────────
  { brand:'Grundfos', serie:'CR', cr_family:'CR 64', model:'CR 64-2', stages:2,  P_kw:7.5,  IP:55, conn:'DN 125 flange', pn:16, DN_mm:125, temp_max:120, code:'96540002', prix_ht:11200,app:'Industrie,collectivités' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 64', model:'CR 64-3', stages:3,  P_kw:11.0, IP:55, conn:'DN 125 flange', pn:16, DN_mm:125, temp_max:120, code:'96540003', prix_ht:13600,app:'Industrie,collectivités' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 64', model:'CR 64-4', stages:4,  P_kw:15.0, IP:55, conn:'DN 125 flange', pn:16, DN_mm:125, temp_max:120, code:'96540004', prix_ht:16400,app:'Industrie,collectivités' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 64', model:'CR 64-6', stages:6,  P_kw:22.0, IP:55, conn:'DN 125 flange', pn:25, DN_mm:125, temp_max:120, code:'96540006', prix_ht:21000,app:'Industrie,HTB' },

  // ── CR 95+ ────────────────────────────────────────────
  { brand:'Grundfos', serie:'CR', cr_family:'CR 95',  model:'CR 95-1',  stages:1, P_kw:5.5,  IP:55, conn:'DN 150 flange', pn:16, DN_mm:150, temp_max:120, code:'96543001', prix_ht:15800,app:'Collectivités,industrie lourde' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 95',  model:'CR 95-2',  stages:2, P_kw:11.0, IP:55, conn:'DN 150 flange', pn:16, DN_mm:150, temp_max:120, code:'96543002', prix_ht:20400,app:'Collectivités,industrie lourde' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 95',  model:'CR 95-3',  stages:3, P_kw:15.0, IP:55, conn:'DN 150 flange', pn:16, DN_mm:150, temp_max:120, code:'96543003', prix_ht:25600,app:'Collectivités,industrie lourde' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 125', model:'CR 125-1', stages:1, P_kw:7.5,  IP:55, conn:'DN 150 flange', pn:16, DN_mm:150, temp_max:120, code:'96547001', prix_ht:20000,app:'Collectivités,grande industrie' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 125', model:'CR 125-2', stages:2, P_kw:15.0, IP:55, conn:'DN 150 flange', pn:16, DN_mm:150, temp_max:120, code:'96547002', prix_ht:28000,app:'Collectivités,grande industrie' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 125', model:'CR 125-3', stages:3, P_kw:22.0, IP:55, conn:'DN 150 flange', pn:25, DN_mm:150, temp_max:120, code:'96547003', prix_ht:38000,app:'Collectivités,grande industrie' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 155', model:'CR 155-1', stages:1, P_kw:11.0, IP:55, conn:'DN 200 flange', pn:16, DN_mm:200, temp_max:120, code:'96551001', prix_ht:28000,app:'Grande industrie,collectivités' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 155', model:'CR 155-2', stages:2, P_kw:22.0, IP:55, conn:'DN 200 flange', pn:16, DN_mm:200, temp_max:120, code:'96551002', prix_ht:38000,app:'Grande industrie,collectivités' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 215', model:'CR 215-1', stages:1, P_kw:15.0, IP:55, conn:'DN 200 flange', pn:16, DN_mm:200, temp_max:120, code:'96555001', prix_ht:34000,app:'Grande industrie,collectivités' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 215', model:'CR 215-2', stages:2, P_kw:30.0, IP:55, conn:'DN 200 flange', pn:25, DN_mm:200, temp_max:120, code:'96555002', prix_ht:48000,app:'Grande industrie,collectivités' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 255', model:'CR 255-1', stages:1, P_kw:18.5, IP:55, conn:'DN 250 flange', pn:16, DN_mm:250, temp_max:120, code:'96560001', prix_ht:40000,app:'Grande industrie,collectivités' },
  { brand:'Grundfos', serie:'CR', cr_family:'CR 255', model:'CR 255-2', stages:2, P_kw:37.0, IP:55, conn:'DN 250 flange', pn:25, DN_mm:250, temp_max:120, code:'96560002', prix_ht:55000,app:'Grande industrie,collectivités' },

  // ════════════════════════════════════════════════════════
  // GRUNDFOS SP — Submersible forage
  // SP XA ou SP X → X = débit nominal en m³/h
  // ════════════════════════════════════════════════════════

  // ── SP 1A : Q_nom=1 m³/h, Q_max réel 1.4 m³/h ───────
  { brand:'Grundfos', serie:'SP', sp_family:'SP 1A', model:'SP 1A-9',  stages:9,  P_kw:0.37, IP:68, conn:'Rp 1 1/4', pn:40, DN_mm:32, temp_max:30, code:'09510K09', prix_ht:820,  app:'Forage 4",eau potable,domestique', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 1A', model:'SP 1A-14', stages:14, P_kw:0.37, IP:68, conn:'Rp 1 1/4', pn:40, DN_mm:32, temp_max:30, code:'09510K14', prix_ht:950,  app:'Forage 4",eau potable', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 1A', model:'SP 1A-18', stages:18, P_kw:0.55, IP:68, conn:'Rp 1 1/4', pn:40, DN_mm:32, temp_max:30, code:'09510K18', prix_ht:1050, app:'Forage 4",eau potable', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 1A', model:'SP 1A-28', stages:28, P_kw:0.75, IP:68, conn:'Rp 1 1/4', pn:60, DN_mm:32, temp_max:30, code:'09510K28', prix_ht:1250, app:'Forage 4",HTB', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 1A', model:'SP 1A-42', stages:42, P_kw:1.1,  IP:68, conn:'Rp 1 1/4', pn:60, DN_mm:32, temp_max:30, code:'09510K42', prix_ht:1620, app:'Forage 4",HTB', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 1A', model:'SP 1A-57', stages:57, P_kw:1.5,  IP:68, conn:'Rp 1 1/4', pn:60, DN_mm:32, temp_max:30, code:'09510K57', prix_ht:1980, app:'Forage 4",HTB', borehole_min:100 },

  // ── SP 2A : Q_nom=2 m³/h, Q_max réel 2.7 m³/h ───────
  { brand:'Grundfos', serie:'SP', sp_family:'SP 2A', model:'SP 2A-6',  stages:6,  P_kw:0.37, IP:68, conn:'Rp 1 1/4', pn:25, DN_mm:32, temp_max:30, code:'09520K06', prix_ht:870,  app:'Forage 4",irrigation,habitat', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 2A', model:'SP 2A-9',  stages:9,  P_kw:0.55, IP:68, conn:'Rp 1 1/4', pn:25, DN_mm:32, temp_max:30, code:'09520K09', prix_ht:1020, app:'Forage 4",eau potable', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 2A', model:'SP 2A-13', stages:13, P_kw:0.75, IP:68, conn:'Rp 1 1/4', pn:25, DN_mm:32, temp_max:30, code:'09520K13', prix_ht:1180, app:'Forage 4",eau potable', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 2A', model:'SP 2A-18', stages:18, P_kw:1.1,  IP:68, conn:'Rp 1 1/4', pn:25, DN_mm:32, temp_max:30, code:'09520K18', prix_ht:1320, app:'Forage 4",eau potable', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 2A', model:'SP 2A-23', stages:23, P_kw:1.1,  IP:68, conn:'Rp 1 1/4', pn:40, DN_mm:32, temp_max:30, code:'09520K23', prix_ht:1480, app:'Forage 4",HTB', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 2A', model:'SP 2A-33', stages:33, P_kw:1.5,  IP:68, conn:'Rp 1 1/4', pn:40, DN_mm:32, temp_max:30, code:'09520K33', prix_ht:1850, app:'Forage 4",HTB', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 2A', model:'SP 2A-40', stages:40, P_kw:2.2,  IP:68, conn:'Rp 1 1/4', pn:40, DN_mm:32, temp_max:30, code:'09520K40', prix_ht:2100, app:'Forage 4",HTB', borehole_min:100 },

  // ── SP 3A : Q_nom=3 m³/h, Q_max réel 3.6 m³/h ───────
  { brand:'Grundfos', serie:'SP', sp_family:'SP 3A', model:'SP 3A-6',  stages:6,  P_kw:0.55, IP:68, conn:'Rp 1 1/4', pn:25, DN_mm:32, temp_max:30, code:'09530K06', prix_ht:920,  app:'Forage 4",irrigation', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 3A', model:'SP 3A-9',  stages:9,  P_kw:0.75, IP:68, conn:'Rp 1 1/4', pn:25, DN_mm:32, temp_max:30, code:'09530K09', prix_ht:1080, app:'Forage 4",eau potable', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 3A', model:'SP 3A-12', stages:12, P_kw:1.1,  IP:68, conn:'Rp 1 1/4', pn:25, DN_mm:32, temp_max:30, code:'09530K12', prix_ht:1240, app:'Forage 4",eau potable', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 3A', model:'SP 3A-15', stages:15, P_kw:1.5,  IP:68, conn:'Rp 1 1/4', pn:25, DN_mm:32, temp_max:30, code:'09530K15', prix_ht:1450, app:'Forage 4",eau potable', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 3A', model:'SP 3A-22', stages:22, P_kw:2.2,  IP:68, conn:'Rp 1 1/4', pn:40, DN_mm:32, temp_max:30, code:'09530K22', prix_ht:1780, app:'Forage 4",HTB', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 3A', model:'SP 3A-33', stages:33, P_kw:3.0,  IP:68, conn:'Rp 1 1/4', pn:40, DN_mm:32, temp_max:30, code:'09530K33', prix_ht:2280, app:'Forage 4",HTB', borehole_min:100 },

  // ── SP 5A : Q_nom=5 m³/h, Q_max réel 6.4 m³/h ───────
  { brand:'Grundfos', serie:'SP', sp_family:'SP 5A', model:'SP 5A-4',  stages:4,  P_kw:0.37, IP:68, conn:'Rp 1 1/2', pn:25, DN_mm:40, temp_max:30, code:'09550K04', prix_ht:880,  app:'Forage 4",usage domestique', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 5A', model:'SP 5A-6',  stages:6,  P_kw:0.55, IP:68, conn:'Rp 1 1/2', pn:25, DN_mm:40, temp_max:30, code:'09550K06', prix_ht:1050, app:'Forage 4",irrigation,domestique', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 5A', model:'SP 5A-8',  stages:8,  P_kw:0.75, IP:68, conn:'Rp 1 1/2', pn:25, DN_mm:40, temp_max:30, code:'09550K08', prix_ht:1180, app:'Forage 4",irrigation', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 5A', model:'SP 5A-12', stages:12, P_kw:1.1,  IP:68, conn:'Rp 1 1/2', pn:25, DN_mm:40, temp_max:30, code:'09550K12', prix_ht:1480, app:'Forage 4",eau potable', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 5A', model:'SP 5A-17', stages:17, P_kw:1.5,  IP:68, conn:'Rp 1 1/2', pn:40, DN_mm:40, temp_max:30, code:'09550K17', prix_ht:1780, app:'Forage 4",eau potable', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 5A', model:'SP 5A-21', stages:21, P_kw:2.2,  IP:68, conn:'Rp 1 1/2', pn:40, DN_mm:40, temp_max:30, code:'09550K21', prix_ht:2050, app:'Forage 4",eau potable', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 5A', model:'SP 5A-25', stages:25, P_kw:2.2,  IP:68, conn:'Rp 1 1/2', pn:40, DN_mm:40, temp_max:30, code:'09550K25', prix_ht:2350, app:'Forage 4",HTB', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 5A', model:'SP 5A-33', stages:33, P_kw:3.0,  IP:68, conn:'Rp 1 1/2', pn:60, DN_mm:40, temp_max:30, code:'09550K33', prix_ht:2980, app:'Forage 4",HTB', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 5A', model:'SP 5A-44', stages:44, P_kw:4.0,  IP:68, conn:'Rp 1 1/2', pn:60, DN_mm:40, temp_max:30, code:'09550K44', prix_ht:3980, app:'Forage 4",HTB', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 5A', model:'SP 5A-52', stages:52, P_kw:5.5,  IP:68, conn:'Rp 1 1/2', pn:60, DN_mm:40, temp_max:30, code:'09550K52', prix_ht:4850, app:'Forage 4",HTB', borehole_min:100 },

  // ── SP 7 : Q_nom=7 m³/h, Q_max réel 9 m³/h ──────────
  { brand:'Grundfos', serie:'SP', sp_family:'SP 7', model:'SP 7-3',  stages:3,  P_kw:0.55, IP:68, conn:'Rp 1 1/2', pn:25, DN_mm:40, temp_max:30, code:'09570K03', prix_ht:1180, app:'Forage 4",agriculture,collectivités', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 7', model:'SP 7-5',  stages:5,  P_kw:0.75, IP:68, conn:'Rp 1 1/2', pn:25, DN_mm:40, temp_max:30, code:'09570K05', prix_ht:1380, app:'Forage 4",agriculture', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 7', model:'SP 7-8',  stages:8,  P_kw:1.1,  IP:68, conn:'Rp 1 1/2', pn:25, DN_mm:40, temp_max:30, code:'09570K08', prix_ht:1780, app:'Forage 4",agriculture', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 7', model:'SP 7-12', stages:12, P_kw:1.5,  IP:68, conn:'Rp 1 1/2', pn:25, DN_mm:40, temp_max:30, code:'09570K12', prix_ht:2180, app:'Forage 4",agriculture', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 7', model:'SP 7-17', stages:17, P_kw:2.2,  IP:68, conn:'Rp 1 1/2', pn:40, DN_mm:40, temp_max:30, code:'09570K17', prix_ht:2780, app:'Forage 4",HTB', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 7', model:'SP 7-23', stages:23, P_kw:3.0,  IP:68, conn:'Rp 1 1/2', pn:40, DN_mm:40, temp_max:30, code:'09570K23', prix_ht:3480, app:'Forage 4",HTB', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 7', model:'SP 7-31', stages:31, P_kw:4.0,  IP:68, conn:'Rp 1 1/2', pn:60, DN_mm:40, temp_max:30, code:'09570K31', prix_ht:4480, app:'Forage 4",HTB', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 7', model:'SP 7-42', stages:42, P_kw:5.5,  IP:68, conn:'Rp 1 1/2', pn:60, DN_mm:40, temp_max:30, code:'09570K42', prix_ht:5800, app:'Forage 4",HTB', borehole_min:100 },

  // ── SP 9 : Q_nom=9 m³/h, Q_max réel 11 m³/h ─────────
  { brand:'Grundfos', serie:'SP', sp_family:'SP 9', model:'SP 9-4',  stages:4,  P_kw:0.75, IP:68, conn:'Rp 2', pn:25, DN_mm:50, temp_max:30, code:'09590K04', prix_ht:1280, app:'Forage 4",agriculture,collectivités', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 9', model:'SP 9-5',  stages:5,  P_kw:1.1,  IP:68, conn:'Rp 2', pn:25, DN_mm:50, temp_max:30, code:'09590K05', prix_ht:1480, app:'Forage 4",agriculture', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 9', model:'SP 9-8',  stages:8,  P_kw:1.5,  IP:68, conn:'Rp 2', pn:25, DN_mm:50, temp_max:30, code:'09590K08', prix_ht:1880, app:'Forage 4",agriculture', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 9', model:'SP 9-10', stages:10, P_kw:2.2,  IP:68, conn:'Rp 2', pn:25, DN_mm:50, temp_max:30, code:'09590K10', prix_ht:2280, app:'Forage 4",collectivités', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 9', model:'SP 9-13', stages:13, P_kw:3.0,  IP:68, conn:'Rp 2', pn:25, DN_mm:50, temp_max:30, code:'09590K13', prix_ht:2780, app:'Forage 4",HTB', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 9', model:'SP 9-18', stages:18, P_kw:4.0,  IP:68, conn:'Rp 2', pn:40, DN_mm:50, temp_max:30, code:'09590K18', prix_ht:3580, app:'Forage 4",HTB', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 9', model:'SP 9-25', stages:25, P_kw:5.5,  IP:68, conn:'Rp 2', pn:40, DN_mm:50, temp_max:30, code:'09590K25', prix_ht:4580, app:'Forage 4",HTB', borehole_min:100 },

  // ── SP 11 : Q_nom=11 m³/h ────────────────────────────
  { brand:'Grundfos', serie:'SP', sp_family:'SP 11', model:'SP 11-3', stages:3,  P_kw:1.5,  IP:68, conn:'Rp 2', pn:25, DN_mm:50, temp_max:30, code:'09511K03', prix_ht:1680, app:'Forage 4",agriculture,collectivités', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 11', model:'SP 11-5', stages:5,  P_kw:2.2,  IP:68, conn:'Rp 2', pn:25, DN_mm:50, temp_max:30, code:'09511K05', prix_ht:2180, app:'Forage 4",agriculture', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 11', model:'SP 11-7', stages:7,  P_kw:3.0,  IP:68, conn:'Rp 2', pn:25, DN_mm:50, temp_max:30, code:'09511K07', prix_ht:2780, app:'Forage 4",collectivités', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 11', model:'SP 11-10',stages:10, P_kw:4.0,  IP:68, conn:'Rp 2', pn:40, DN_mm:50, temp_max:30, code:'09511K10', prix_ht:3380, app:'Forage 4",HTB', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 11', model:'SP 11-14',stages:14, P_kw:5.5,  IP:68, conn:'Rp 2', pn:40, DN_mm:50, temp_max:30, code:'09511K14', prix_ht:4380, app:'Forage 4",HTB', borehole_min:100 },

  // ── SP 14 : Q_nom=14 m³/h ────────────────────────────
  { brand:'Grundfos', serie:'SP', sp_family:'SP 14', model:'SP 14-4', stages:4,  P_kw:2.2,  IP:68, conn:'Rp 2', pn:25, DN_mm:50, temp_max:30, code:'09514K04', prix_ht:2350, app:'Forage 4",agriculture,collectivités', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 14', model:'SP 14-6', stages:6,  P_kw:3.0,  IP:68, conn:'Rp 2', pn:25, DN_mm:50, temp_max:30, code:'09514K06', prix_ht:2880, app:'Forage 4",collectivités', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 14', model:'SP 14-8', stages:8,  P_kw:4.0,  IP:68, conn:'Rp 2', pn:25, DN_mm:50, temp_max:30, code:'09514K08', prix_ht:3480, app:'Forage 4",HTB', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 14', model:'SP 14-11',stages:11, P_kw:5.5,  IP:68, conn:'Rp 2', pn:40, DN_mm:50, temp_max:30, code:'09514K11', prix_ht:4350, app:'Forage 4",HTB', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 14', model:'SP 14-15',stages:15, P_kw:7.5,  IP:68, conn:'Rp 2', pn:40, DN_mm:50, temp_max:30, code:'09514K15', prix_ht:5600, app:'Forage 4",HTB', borehole_min:100 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 14', model:'SP 14-20',stages:20, P_kw:9.2,  IP:68, conn:'Rp 2', pn:40, DN_mm:50, temp_max:30, code:'09514K20', prix_ht:7100, app:'Forage 4",HTB', borehole_min:100 },

  // ── SP 18 (6") : Q_nom=18 m³/h ───────────────────────
  { brand:'Grundfos', serie:'SP', sp_family:'SP 18', model:'SP 18-18',stages:18, P_kw:13.0, IP:68, conn:'Rp 2 1/2', pn:25, DN_mm:65, temp_max:30, code:'09518K18', prix_ht:8200, app:'Forage 6",agriculture,collectivités', borehole_min:152 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 18', model:'SP 18-20',stages:20, P_kw:15.0, IP:68, conn:'Rp 2 1/2', pn:25, DN_mm:65, temp_max:30, code:'09518K20', prix_ht:9100, app:'Forage 6",agriculture', borehole_min:152 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 18', model:'SP 18-25',stages:25, P_kw:18.5, IP:68, conn:'Rp 2 1/2', pn:25, DN_mm:65, temp_max:30, code:'09518K25', prix_ht:11200,app:'Forage 6",collectivités', borehole_min:152 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 18', model:'SP 18-33',stages:33, P_kw:22.0, IP:68, conn:'Rp 2 1/2', pn:40, DN_mm:65, temp_max:30, code:'09518K33', prix_ht:14500,app:'Forage 6",HTB', borehole_min:152 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 18', model:'SP 18-40',stages:40, P_kw:26.0, IP:68, conn:'Rp 2 1/2', pn:40, DN_mm:65, temp_max:30, code:'09518K40', prix_ht:17200,app:'Forage 6",HTB', borehole_min:152 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 18', model:'SP 18-48',stages:48, P_kw:30.0, IP:68, conn:'Rp 2 1/2', pn:40, DN_mm:65, temp_max:30, code:'09518K48', prix_ht:20500,app:'Forage 6",HTB', borehole_min:152 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 18', model:'SP 18-60',stages:60, P_kw:37.0, IP:68, conn:'Rp 2 1/2', pn:40, DN_mm:65, temp_max:30, code:'09518K60', prix_ht:26800,app:'Forage 6",HTB', borehole_min:152 },

  // ── SP 32 (6") ────────────────────────────────────────
  { brand:'Grundfos', serie:'SP', sp_family:'SP 32', model:'SP 32-20',stages:20, P_kw:13.0, IP:68, conn:'Rp 3',     pn:25, DN_mm:80, temp_max:30, code:'09532K20', prix_ht:8200, app:'Forage 6",irrigation intensive,collectivités', borehole_min:152 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 32', model:'SP 32-25',stages:25, P_kw:15.0, IP:68, conn:'Rp 3',     pn:25, DN_mm:80, temp_max:30, code:'09532K25', prix_ht:9600, app:'Forage 6",agriculture', borehole_min:152 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 32', model:'SP 32-33',stages:33, P_kw:18.5, IP:68, conn:'Rp 3',     pn:40, DN_mm:80, temp_max:30, code:'09532K33', prix_ht:12500,app:'Forage 6",HTB', borehole_min:152 },

  // ── SP 46 (6") ────────────────────────────────────────
  { brand:'Grundfos', serie:'SP', sp_family:'SP 46', model:'SP 46-2', stages:2,  P_kw:5.5,  IP:68, conn:'Rp 4',     pn:25, DN_mm:100,temp_max:30, code:'09546K02', prix_ht:6400, app:'Forage 6",irrigation,collectivités', borehole_min:168 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 46', model:'SP 46-4', stages:4,  P_kw:9.2,  IP:68, conn:'Rp 4',     pn:25, DN_mm:100,temp_max:30, code:'09546K04', prix_ht:9200, app:'Forage 6",agriculture', borehole_min:168 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 46', model:'SP 46-7', stages:7,  P_kw:15.0, IP:68, conn:'Rp 4',     pn:40, DN_mm:100,temp_max:30, code:'09546K07', prix_ht:14200,app:'Forage 6",HTB', borehole_min:168 },

  // ── SP 60 (6") ────────────────────────────────────────
  { brand:'Grundfos', serie:'SP', sp_family:'SP 60', model:'SP 60-3', stages:3,  P_kw:9.2,  IP:68, conn:'Rp 4',     pn:25, DN_mm:100,temp_max:30, code:'09560K03', prix_ht:9800, app:'Forage 6",irrigation intensive,collectivités', borehole_min:168 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 60', model:'SP 60-5', stages:5,  P_kw:15.0, IP:68, conn:'Rp 4',     pn:40, DN_mm:100,temp_max:30, code:'09560K05', prix_ht:14800,app:'Forage 6",collectivités', borehole_min:168 },

  // ── SP 77 (8") ────────────────────────────────────────
  { brand:'Grundfos', serie:'SP', sp_family:'SP 77', model:'SP 77-3', stages:3,  P_kw:11.0, IP:68, conn:'Rp 5',     pn:25, DN_mm:125,temp_max:30, code:'09577K03', prix_ht:14500,app:'Forage 8",eau potable collectivités', borehole_min:200 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 77', model:'SP 77-5', stages:5,  P_kw:18.5, IP:68, conn:'Rp 5',     pn:40, DN_mm:125,temp_max:30, code:'09577K05', prix_ht:21500,app:'Forage 8",collectivités', borehole_min:200 },

  // ── SP 95 (8") ────────────────────────────────────────
  { brand:'Grundfos', serie:'SP', sp_family:'SP 95', model:'SP 95-3', stages:3,  P_kw:15.0, IP:68, conn:'Rp 5',     pn:25, DN_mm:125,temp_max:30, code:'09595K03', prix_ht:18500,app:'Forage 8",AEP,collectivités', borehole_min:200 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 95', model:'SP 95-5', stages:5,  P_kw:22.0, IP:68, conn:'Rp 5',     pn:40, DN_mm:125,temp_max:30, code:'09595K05', prix_ht:28000,app:'Forage 8",AEP', borehole_min:200 },

  // ── SP 125 (10") ──────────────────────────────────────
  { brand:'Grundfos', serie:'SP', sp_family:'SP 125', model:'SP 125-3',stages:3, P_kw:22.0, IP:68, conn:'Rp 6',     pn:25, DN_mm:150,temp_max:30, code:'09512K03', prix_ht:28000,app:'Forage 10",AEP,périmètre irrigué', borehole_min:254 },
  { brand:'Grundfos', serie:'SP', sp_family:'SP 125', model:'SP 125-5',stages:5, P_kw:37.0, IP:68, conn:'Rp 6',     pn:40, DN_mm:150,temp_max:30, code:'09512K05', prix_ht:42000,app:'Forage 10",AEP', borehole_min:254 },

  // ── SP 160 (10") ──────────────────────────────────────
  { brand:'Grundfos', serie:'SP', sp_family:'SP 160', model:'SP 160-3',stages:3, P_kw:30.0, IP:68, conn:'Rp 6',     pn:25, DN_mm:150,temp_max:30, code:'09516K03', prix_ht:38000,app:'Forage 10",grande AEP', borehole_min:254 },

  // ── SP 215 (10") ──────────────────────────────────────
  { brand:'Grundfos', serie:'SP', sp_family:'SP 215', model:'SP 215-2',stages:2, P_kw:37.0, IP:68, conn:'Rp 6',     pn:25, DN_mm:150,temp_max:30, code:'09521K02', prix_ht:52000,app:'Forage 10",grande AEP,irrigation intensive', borehole_min:254 },
];

const PumpSelector = () => {
  const [Q, setQ] = useState(30);
  const [H, setH] = useState(25);
  const [serie, setSerie] = useState('all');
  const [borehole, setBorehole] = useState(200);
  const [temp, setTemp] = useState(20);
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [searched, setSearched] = useState(false);
  const [sortBy, setSortBy] = useState('score');
  const [showCurve, setShowCurve] = useState(false);

  const findPumps = () => {
    const scored = PUMP_DB
      .filter(p => {
        if (serie !== 'all' && p.serie !== serie) return false;
        if (p.borehole_min && borehole < p.borehole_min) return false;
        if (temp > p.temp_max) return false;
        // Vérifier via courbe si Q/H est atteignable
        const at = getPumpAtQ(p, Q);
        if (!at) return false;
        if (at.H <= 0) return false;
        // Tolérance : H_courbe doit être entre 85% et 115% du H demandé
        if (at.H < H * 0.80 || at.H > H * 1.30) return false;
        return true;
      })
      .map(p => {
        const at = getPumpAtQ(p, Q);
        const H_curve = at?.H || 0;
        const eta_curve = at?.eta || 0;
        const delta_H = Math.abs(H_curve - H) / H * 100; // % d'écart
        // Score basé sur proximité HMT + rendement
        const score_H = Math.max(0, 100 - delta_H * 3);
        const score_eta = eta_curve;
        const score = score_H * 0.6 + score_eta * 0.4;
        return { ...p, at_Q: at, score: parseFloat(score.toFixed(1)), delta_H: parseFloat(delta_H.toFixed(1)) };
      })
      .filter(p => p.score > 0)
      .sort((a,b) => {
        if (sortBy==='score') return b.score - a.score;
        if (sortBy==='prix')  return (a.prix_ht||0)-(b.prix_ht||0);
        if (sortBy==='eta')   return (b.at_Q?.eta||0)-(a.at_Q?.eta||0);
        if (sortBy==='P')     return (a.at_Q?.Pa||0)-(b.at_Q?.Pa||0);
        return b.score - a.score;
      })
      .slice(0, 12);
    setResults(scored);
    setSelected(null);
    setSearched(true);
    setShowCurve(false);
  };

  const getMatchColor = s => s >= 75?'#16a34a':s>=55?'#d97706':'#ef4444';
  const getMatchLabel = s => s >= 75?'✅ Excellent':s>=55?'⚠️ Acceptable':'❌ Hors plage';

  // Génère les points de courbe Q/H pour l'affichage graphique
  const getCurvePoints = (pump) => {
    const qh = getPumpCurveQH(pump);
    if (!qh) return [];
    return qh;
  };

  const SVGCurve = ({ pump, Q_target, H_target }) => {
    const pts = getCurvePoints(pump);
    const etaPts = getPumpEtaCurve(pump) || [];
    if (!pts.length) return null;
    const Q_max = pts[pts.length-1][0];
    const H_max_curve = pts[0][1];
    const eta_max = 100;
    const W=500, H_svg=220, padL=50, padR=20, padT=15, padB=35;
    const W_plot = W - padL - padR;
    const H_plot = H_svg - padT - padB;
    const xS = q => padL + (q/Q_max) * W_plot;
    const yS = h => padT + H_plot - (h/H_max_curve) * H_plot;
    const yE = e => padT + H_plot - (e/eta_max) * H_plot;
    // Courbe Q/H
    const dQH = pts.map(([q,h],i) => `${i===0?'M':'L'} ${xS(q)} ${yS(h)}`).join(' ');
    // Courbe Eta
    const dEta = etaPts.length ? etaPts.map(([q,e],i) => `${i===0?'M':'L'} ${xS(q)} ${yE(e)}`).join(' ') : '';
    // Point de fonctionnement
    const Hq = interpolate(pts, Q_target);
    const eq = etaPts.length ? interpolate(etaPts, Q_target) : null;
    const gridQ = [0, Q_max*0.25, Q_max*0.5, Q_max*0.75, Q_max].map(v=>parseFloat(v.toFixed(1)));
    const gridH = [0, H_max_curve*0.25, H_max_curve*0.5, H_max_curve*0.75, H_max_curve].map(v=>parseFloat(v.toFixed(0)));
    return (
      <svg width="100%" viewBox={`0 0 ${W} ${H_svg}`} style={{ background:'#f8fafc', borderRadius:'8px', border:'1px solid #e2e8f0' }}>
        {/* Grid */}
        {gridQ.map(q=><line key={q} x1={xS(q)} y1={padT} x2={xS(q)} y2={padT+H_plot} stroke="#e2e8f0" strokeWidth="0.5"/>)}
        {gridH.map(h=><line key={h} x1={padL} y1={yS(h)} x2={padL+W_plot} y2={yS(h)} stroke="#e2e8f0" strokeWidth="0.5"/>)}
        {/* Labels axes */}
        {gridQ.map(q=><text key={q} x={xS(q)} y={padT+H_plot+14} textAnchor="middle" fontSize="8" fill="#94a3b8">{q}</text>)}
        {gridH.map(h=><text key={h} x={padL-5} y={yS(h)+3} textAnchor="end" fontSize="8" fill="#94a3b8">{h}</text>)}
        <text x={W/2} y={H_svg-2} textAnchor="middle" fontSize="8" fill="#64748b">Q (m³/h)</text>
        <text x={12} y={H_svg/2} textAnchor="middle" fontSize="8" fill="#1d4ed8" transform={`rotate(-90,12,${H_svg/2})`}>H (m)</text>
        {/* Courbe Q/H */}
        <path d={dQH} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Courbe Eta */}
        {dEta&&<path d={dEta} fill="none" stroke="#d97706" strokeWidth="1.5" strokeDasharray="5 2"/>}
        {/* Ligne H demandée */}
        {H_target<=H_max_curve&&<line x1={padL} y1={yS(H_target)} x2={padL+W_plot} y2={yS(H_target)} stroke="#dc2626" strokeWidth="1" strokeDasharray="4 2"/>}
        {/* Ligne Q demandé */}
        {Q_target<=Q_max&&<line x1={xS(Q_target)} y1={padT} x2={xS(Q_target)} y2={padT+H_plot} stroke="#059669" strokeWidth="1" strokeDasharray="4 2"/>}
        {/* Point de fonctionnement */}
        {Hq&&Q_target<=Q_max&&<>
          <circle cx={xS(Q_target)} cy={yS(Hq)} r={6} fill="#dc2626" stroke="white" strokeWidth="2"/>
          <rect x={xS(Q_target)+8} y={yS(Hq)-20} width={120} height={30} rx="4" fill="rgba(255,255,255,0.9)" stroke="#dc2626" strokeWidth="1"/>
          <text x={xS(Q_target)+14} y={yS(Hq)-8} fontSize="7.5" fontWeight="700" fill="#dc2626">H={Hq.toFixed(1)}m à Q={Q_target}m³/h</text>
          {eq&&<text x={xS(Q_target)+14} y={yS(Hq)+6} fontSize="7" fill="#d97706">η={eq.toFixed(1)}%</text>}
        </>}
        {/* Légende */}
        <line x1={padL+10} y1={padT+8} x2={padL+25} y2={padT+8} stroke="#2563eb" strokeWidth="2.5"/>
        <text x={padL+28} y={padT+12} fontSize="7.5" fill="#2563eb">Courbe Q/H</text>
        {dEta&&<><line x1={padL+90} y1={padT+8} x2={padL+105} y2={padT+8} stroke="#d97706" strokeWidth="1.5" strokeDasharray="5 2"/>
        <text x={padL+108} y={padT+12} fontSize="7.5" fill="#d97706">Rendement η</text></>}
      </svg>
    );
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'16px', fontFamily:"'Inter','Segoe UI',sans-serif" }}>

      {/* Bandeau titre */}
      <div style={{ background:'linear-gradient(135deg,#0f172a,#1e40af)', borderRadius:'14px', padding:'18px 24px', color:'white' }}>
        <div style={{ fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.12em', opacity:0.6, textTransform:'uppercase', marginBottom:'3px' }}>Sélection par courbes Q/H réelles — Grundfos 2025/2026</div>
        <div style={{ fontSize:'1.25rem', fontWeight:800, marginBottom:'2px' }}>⚙️ Sélection de Pompes</div>
        <div style={{ fontSize:'0.75rem', opacity:0.6 }}>Interpolation sur courbes Q/H + η extraites des databooklets · CR & SP · 50 Hz · {PUMP_DB.length} modèles</div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
        {/* Formulaire gauche */}
        <div style={{ background:'white', borderRadius:'14px', border:'1px solid #f1f5f9', boxShadow:'0 2px 8px rgba(0,0,0,0.04)', padding:'18px 20px', display:'flex', flexDirection:'column', gap:'14px' }}>
          <div style={{ fontSize:'0.75rem', fontWeight:700, color:'#2563eb', textTransform:'uppercase', letterSpacing:'0.08em', paddingBottom:'8px', borderBottom:'2px solid #eff6ff' }}>💧 Point de fonctionnement</div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
            {[{l:'Débit Q',v:Q,sv:setQ,u:'m³/h',icon:'💧'},{l:'HMT',v:H,sv:setH,u:'m',icon:'📐'}].map(({l,v,sv,u,icon})=>{
              const [r,sr]=useState(String(v));
              useEffect(()=>sr(String(v)),[v]);
              return (
                <div key={l}>
                  <label style={{display:'block',fontSize:'0.7rem',fontWeight:700,color:'#475569',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.04em'}}>{icon} {l} <span style={{color:'#94a3b8',textTransform:'none',fontWeight:400}}>({u})</span></label>
                  <input type="text" inputMode="decimal" value={r}
                    onChange={e=>sr(e.target.value)}
                    onBlur={e=>{const n=parseFloat(e.target.value);if(!isNaN(n)){sv(n);sr(String(n));}else sr(String(v));}}
                    onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}} onFocus={e=>e.target.select()}
                    style={{width:'100%',boxSizing:'border-box',padding:'10px 12px',border:'1.5px solid #e2e8f0',borderRadius:'8px',fontSize:'1rem',fontWeight:700,color:'#1e293b',fontFamily:'monospace',outline:'none'}}
                  />
                </div>
              );
            })}
          </div>

          {/* Série */}
          <div>
            <label style={{display:'block',fontSize:'0.7rem',fontWeight:700,color:'#475569',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'0.04em'}}>🔧 Série</label>
            <div style={{display:'flex',gap:'6px'}}>
              {[{v:'all',l:'Toutes',icon:'🔍',d:'CR + SP'},{v:'CR',l:'CR Multicellulaire',icon:'🔷',d:'Surface'},{v:'SP',l:'SP Forage',icon:'🔵',d:'Immergée'}].map(opt=>(
                <button key={opt.v} onClick={()=>setSerie(opt.v)} style={{flex:1,padding:'8px 6px',borderRadius:'8px',border:`2px solid ${serie===opt.v?'#2563eb':'#e2e8f0'}`,background:serie===opt.v?'#eff6ff':'white',cursor:'pointer',textAlign:'center'}}>
                  <div style={{fontSize:'1rem'}}>{opt.icon}</div>
                  <div style={{fontSize:'0.68rem',fontWeight:serie===opt.v?700:500,color:serie===opt.v?'#1d4ed8':'#475569'}}>{opt.l}</div>
                  <div style={{fontSize:'0.6rem',color:'#94a3b8'}}>{opt.d}</div>
                </button>
              ))}
            </div>
          </div>

          {(serie==='SP'||serie==='all')&&(
            <div>
              <label style={{display:'block',fontSize:'0.7rem',fontWeight:700,color:'#1d4ed8',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'0.04em'}}>🕳️ Forage</label>
              <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
                {[{d:100,l:'4" (100mm)'},{d:152,l:'6" (152mm)'},{d:200,l:'8" (200mm)'},{d:254,l:'10" (254mm)'}].map(({d,l})=>(
                  <button key={d} onClick={()=>setBorehole(d)} style={{padding:'5px 10px',borderRadius:'6px',border:`1.5px solid ${borehole===d?'#2563eb':'#e2e8f0'}`,background:borehole===d?'#dbeafe':'#f8fafc',cursor:'pointer',fontSize:'0.72rem',fontWeight:borehole===d?700:400,color:borehole===d?'#1d4ed8':'#475569'}}>{l}</button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label style={{display:'block',fontSize:'0.7rem',fontWeight:700,color:'#475569',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'0.04em'}}>🌡️ Température</label>
            <div style={{display:'flex',gap:'6px'}}>
              {[{v:20,l:'≤ 30°C'},{v:60,l:'≤ 60°C'},{v:90,l:'≤ 90°C'}].map(({v,l})=>(
                <button key={v} onClick={()=>setTemp(v)} style={{flex:1,padding:'6px',borderRadius:'6px',border:`1.5px solid ${temp===v?'#d97706':'#e2e8f0'}`,background:temp===v?'#fef3c7':'white',cursor:'pointer',fontSize:'0.72rem',fontWeight:temp===v?700:400,color:temp===v?'#92400e':'#475569'}}>{l}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Droite : résumé + tri */}
        <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          <div style={{background:'white',borderRadius:'14px',border:'1px solid #f1f5f9',padding:'16px 18px'}}>
            <div style={{fontSize:'0.75rem',fontWeight:700,color:'#059669',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'12px',paddingBottom:'8px',borderBottom:'2px solid #f0fdf4'}}>📊 Point demandé</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
              {[
                {l:'Débit Q',v:`${Q} m³/h`,c:'#2563eb',bg:'#eff6ff'},
                {l:'HMT cible',v:`${H} m`,c:'#059669',bg:'#f0fdf4'},
                {l:'Ph ≈',v:`${((Q*9.81*1000*H)/3600000).toFixed(2)} kW`,c:'#7c3aed',bg:'#faf5ff'},
                {l:'Série',v:serie==='all'?'CR+SP':serie,c:'#1d4ed8',bg:'#dbeafe'},
              ].map(({l,v,c,bg})=>(
                <div key={l} style={{background:bg,borderRadius:'8px',padding:'8px 10px',borderLeft:`3px solid ${c}`}}>
                  <div style={{fontSize:'0.65rem',color:'#94a3b8'}}>{l}</div>
                  <div style={{fontSize:'0.95rem',fontWeight:800,color:c,fontFamily:'monospace'}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{marginTop:'10px',padding:'8px 10px',background:'#f0f9ff',borderRadius:'8px',fontSize:'0.75rem',color:'#0369a1',border:'1px solid #bae6fd'}}>
              <strong>🔬 Méthode :</strong> Interpolation sur courbes Q/H réelles extraites des databooklets Grundfos. H affiché = HMT réelle de la pompe à Q={Q} m³/h.
            </div>
          </div>

          <div style={{background:'white',borderRadius:'12px',border:'1px solid #f1f5f9',padding:'14px 16px'}}>
            <div style={{fontSize:'0.72rem',fontWeight:700,color:'#64748b',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'8px'}}>Trier par</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px'}}>
              {[{v:'score',l:'🎯 Meilleure concordance'},{v:'prix',l:'💶 Prix croissant'},{v:'eta',l:'⚡ Meilleur rendement'},{v:'P',l:'🔋 Puissance mini'}].map(({v,l})=>(
                <button key={v} onClick={()=>setSortBy(v)} style={{padding:'7px 10px',borderRadius:'7px',border:`1.5px solid ${sortBy===v?'#2563eb':'#e2e8f0'}`,background:sortBy===v?'#eff6ff':'white',cursor:'pointer',fontSize:'0.75rem',fontWeight:sortBy===v?700:500,color:sortBy===v?'#1d4ed8':'#475569',textAlign:'left'}}>{l}</button>
              ))}
            </div>
          </div>

          {temp>30&&serie==='SP'&&<div style={{background:'#fff1f2',border:'1.5px solid #fca5a5',borderRadius:'10px',padding:'10px 14px',fontSize:'0.78rem',color:'#dc2626'}}><strong>⚠️</strong> SP limitées à 30°C. Passez sur CR pour eau chaude.</div>}
        </div>
      </div>

      <button onClick={findPumps} style={{padding:'16px',background:'linear-gradient(135deg,#1e40af,#2563eb)',color:'white',border:'none',borderRadius:'12px',fontWeight:800,fontSize:'1.05rem',cursor:'pointer',fontFamily:'inherit',boxShadow:'0 6px 20px rgba(37,99,235,0.35)'}}>
        🔍 Rechercher — Interpolation sur {PUMP_DB.filter(p=>serie==='all'||p.serie===serie).length} modèles
      </button>

      {searched&&results.length===0&&(
        <div style={{background:'#fff1f2',border:'1.5px solid #fca5a5',borderRadius:'12px',padding:'24px',textAlign:'center'}}>
          <div style={{fontSize:'2rem',marginBottom:'8px'}}>😔</div>
          <div style={{fontWeight:700,color:'#dc2626',marginBottom:'4px'}}>Aucun modèle trouvé pour Q={Q} m³/h / HMT={H} m</div>
          <div style={{fontSize:'0.82rem',color:'#b91c1c'}}>Modifiez les critères ou vérifiez le diamètre de forage.</div>
        </div>
      )}

      {results.length>0&&(
        <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          <div style={{fontSize:'0.85rem',fontWeight:700,color:'#1e293b',display:'flex',alignItems:'center',gap:'8px'}}>
            <span>✅ {results.length} modèle{results.length>1?'s':''} — courbes interpolées à Q={Q} m³/h</span>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:'10px'}}>
            {results.map((p,i)=>{
              const at=p.at_Q;
              const isSelected=selected?.model===p.model;
              return (
                <div key={p.model+i} onClick={()=>setSelected(isSelected?null:p)}
                  style={{background:'white',borderRadius:'12px',border:`2px solid ${isSelected?'#2563eb':i===0?'#86efac':'#f1f5f9'}`,boxShadow:i===0?'0 4px 16px rgba(5,150,105,0.12)':'0 1px 4px rgba(0,0,0,0.04)',padding:'14px 16px',cursor:'pointer',position:'relative',transition:'all 0.15s'}}>

                  {i===0&&<div style={{position:'absolute',top:'-10px',left:'14px',background:'linear-gradient(135deg,#059669,#16a34a)',color:'white',fontSize:'0.65rem',fontWeight:800,padding:'2px 10px',borderRadius:'20px'}}>🥇 MEILLEUR CHOIX</div>}

                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'10px'}}>
                    <div>
                      <div style={{fontSize:'1rem',fontWeight:800,color:'#1e293b'}}>{p.model}</div>
                      <div style={{fontSize:'0.7rem',color:'#64748b'}}>{p.brand} · {p.serie==='SP'?`Submersible ${p.sp_family?.includes('18')||p.sp_family?.includes('32')||p.sp_family?.includes('46')||p.sp_family?.includes('60')?'6"':p.sp_family?.includes('77')||p.sp_family?.includes('95')?'8"':p.sp_family?.includes('125')||p.sp_family?.includes('160')||p.sp_family?.includes('215')?'10"':'4"'}`:'Multicellulaire verticale'}</div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div style={{fontSize:'0.72rem',fontWeight:700,color:getMatchColor(p.score),background:getMatchColor(p.score)+'18',padding:'2px 8px',borderRadius:'20px'}}>{getMatchLabel(p.score)}</div>
                    </div>
                  </div>

                  {/* KPIs courbe */}
                  <div style={{background:'#f0fdf4',borderRadius:'8px',padding:'10px 12px',marginBottom:'10px',border:'1.5px solid #86efac'}}>
                    <div style={{fontSize:'0.65rem',color:'#64748b',marginBottom:'5px',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.06em'}}>📍 Valeurs interpolées à Q = {Q} m³/h</div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'6px'}}>
                      <div style={{textAlign:'center'}}>
                        <div style={{fontSize:'1.15rem',fontWeight:800,color:'#059669',fontFamily:'monospace'}}>{at?.H} m</div>
                        <div style={{fontSize:'0.65rem',color:'#64748b'}}>HMT réelle</div>
                        <div style={{fontSize:'0.6rem',color:Math.abs(at?.H-H)/H*100<5?'#16a34a':'#d97706'}}>cible: {H}m (Δ{p.delta_H}%)</div>
                      </div>
                      <div style={{textAlign:'center'}}>
                        <div style={{fontSize:'1.15rem',fontWeight:800,color:'#d97706',fontFamily:'monospace'}}>{at?.eta}%</div>
                        <div style={{fontSize:'0.65rem',color:'#64748b'}}>Rendement η</div>
                      </div>
                      <div style={{textAlign:'center'}}>
                        <div style={{fontSize:'1.15rem',fontWeight:800,color:'#7c3aed',fontFamily:'monospace'}}>{at?.Pa} kW</div>
                        <div style={{fontSize:'0.65rem',color:'#64748b'}}>Pa absorbée</div>
                      </div>
                    </div>
                  </div>

                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'5px',marginBottom:'8px'}}>
                    {[
                      {l:'P moteur',v:`${p.P_kw} kW`,c:'#7c3aed'},
                      {l:'Étages',v:p.stages,c:'#0891b2'},
                      {l:`IP ${p.IP}`,v:`PN${p.pn}`,c:'#475569'},
                    ].map(({l,v,c})=>(
                      <div key={l} style={{background:'#f8fafc',borderRadius:'6px',padding:'4px 6px',textAlign:'center'}}>
                        <div style={{fontSize:'0.8rem',fontWeight:700,color:c}}>{v}</div>
                        <div style={{fontSize:'0.6rem',color:'#94a3b8'}}>{l}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:'8px',borderTop:'1px solid #f1f5f9'}}>
                    <div>
                      <div style={{fontSize:'0.62rem',color:'#94a3b8'}}>{p.code}</div>
                      <div style={{fontSize:'0.62rem',color:'#64748b'}}>{p.conn} — DN{p.DN_mm}</div>
                    </div>
                    {p.prix_ht&&<div style={{fontSize:'1.1rem',fontWeight:800,color:'#1e293b'}}>{p.prix_ht.toLocaleString('fr-FR')} €</div>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fiche détaillée + courbe */}
          {selected&&(()=>{
            const at=selected.at_Q;
            const qhPts=getCurvePoints(selected);
            return (
              <div style={{background:'white',borderRadius:'14px',border:'2px solid #2563eb',padding:'22px 24px',boxShadow:'0 8px 30px rgba(37,99,235,0.12)'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'16px',flexWrap:'wrap',gap:'8px'}}>
                  <div>
                    <div style={{fontSize:'1.4rem',fontWeight:800,color:'#1e293b'}}>{selected.model}</div>
                    <div style={{fontSize:'0.8rem',color:'#64748b'}}>{selected.brand} · {selected.stages} étages · {selected.P_kw} kW · {selected.conn} PN{selected.pn}</div>
                  </div>
                  {selected.prix_ht&&<div style={{fontSize:'1.5rem',fontWeight:800,color:'#059669'}}>{selected.prix_ht.toLocaleString('fr-FR')} € H.T.</div>}
                </div>

                {/* Point de fonctionnement mis en valeur */}
                <div style={{background:'linear-gradient(135deg,#f0fdf4,#dcfce7)',borderRadius:'12px',padding:'16px 18px',marginBottom:'16px',border:'2px solid #86efac'}}>
                  <div style={{fontSize:'0.72rem',fontWeight:700,color:'#065f46',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'10px'}}>📍 Point de fonctionnement — Valeurs lues sur courbe à Q = {Q} m³/h</div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'10px'}}>
                    {[
                      {l:'Q demandé',v:`${Q} m³/h`,c:'#2563eb',icon:'💧'},
                      {l:'HMT réelle',v:`${at?.H} m`,c:'#059669',icon:'📐', sub:`cible ${H}m · écart ${selected.delta_H}%`},
                      {l:'Rendement η',v:`${at?.eta}%`,c:'#d97706',icon:'⚡'},
                      {l:'Pa absorbée',v:`${at?.Pa} kW`,c:'#7c3aed',icon:'🔌'},
                    ].map(({l,v,c,icon,sub})=>(
                      <div key={l} style={{background:'white',borderRadius:'10px',padding:'10px 12px',border:`2px solid ${c}22`,textAlign:'center'}}>
                        <div style={{fontSize:'1.2rem',marginBottom:'2px'}}>{icon}</div>
                        <div style={{fontSize:'1.25rem',fontWeight:800,color:c,fontFamily:'monospace'}}>{v}</div>
                        <div style={{fontSize:'0.68rem',color:'#64748b',fontWeight:600}}>{l}</div>
                        {sub&&<div style={{fontSize:'0.6rem',color:'#94a3b8',marginTop:'2px'}}>{sub}</div>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Courbe SVG */}
                <div style={{marginBottom:'14px'}}>
                  <div style={{fontSize:'0.72rem',fontWeight:700,color:'#1e293b',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'0.06em'}}>📈 Courbe Q/H interpolée — {selected.model}</div>
                  <SVGCurve pump={selected} Q_target={Q} H_target={H}/>
                  <div style={{display:'flex',gap:'12px',marginTop:'6px',fontSize:'0.7rem',color:'#64748b'}}>
                    <span>— Courbe Q/H (bleu) · - - Rendement η (orange) · ⬤ Point de fonctionnement (rouge)</span>
                  </div>
                </div>

                {/* Tableau points courbe */}
                <div>
                  <div style={{fontSize:'0.72rem',fontWeight:700,color:'#1e293b',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'0.06em'}}>📊 Table Q/H de la courbe</div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(100px,1fr))',gap:'4px'}}>
                    {qhPts.filter((_,i)=>i%2===0||i===qhPts.length-1).map(([q,h])=>{
                      const etaC=getPumpEtaCurve(selected);
                      const e=etaC?interpolate(etaC,q):null;
                      const isTarget=Math.abs(q-Q)<0.5;
                      return (
                        <div key={q} style={{background:isTarget?'#dcfce7':'#f8fafc',border:`1px solid ${isTarget?'#86efac':'#e2e8f0'}`,borderRadius:'6px',padding:'5px 8px',textAlign:'center'}}>
                          <div style={{fontSize:'0.7rem',fontWeight:700,color:'#2563eb',fontFamily:'monospace'}}>{q} m³/h</div>
                          <div style={{fontSize:'0.75rem',fontWeight:800,color:'#059669',fontFamily:'monospace'}}>{h} m</div>
                          {e!==null&&<div style={{fontSize:'0.65rem',color:'#d97706',fontFamily:'monospace'}}>{e.toFixed(0)}%</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Infos techniques */}
                <div style={{marginTop:'14px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',fontSize:'0.78rem'}}>
                  {[
                    ['Connexion',`${selected.conn} — PN ${selected.pn}`],
                    ['DN',`${selected.DN_mm} mm`],
                    ['Temp. max',`${selected.temp_max}°C`],
                    ['Code article',selected.code],
                    ['Applications',selected.app],
                    selected.borehole_min?['Forage min',`Ø ${selected.borehole_min} mm`]:null,
                  ].filter(Boolean).map(([l,v])=>(
                    <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'5px 0',borderBottom:'1px solid #f8fafc'}}>
                      <span style={{color:'#64748b'}}>{l}</span><span style={{fontWeight:600,color:'#1e293b'}}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

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
                <input type="text" inputMode="decimal" value={data[f.key]} step="0.1" onChange={e => set(f.key, parseFloat(e.target.value))}
                onFocus={e=>e.target.select()}
                onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
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
