import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';
import logo from './assets/logo-proauto.png';

export default function QuoteForm() {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    marca: '',
    modelo: '',
    ano: '',
    placa: '',
    cidade: '',
    motorizacao: '',
    cambio: '',
    uso: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email inválido';
    
    if (!formData.marca.trim()) newErrors.marca = 'Marca é obrigatória';
    if (!formData.modelo.trim()) newErrors.modelo = 'Modelo é obrigatório';
    if (!formData.ano.trim()) newErrors.ano = 'Ano é obrigatório';
    if (!formData.placa.trim()) newErrors.placa = 'Placa é obrigatória';
    if (!formData.motorizacao.trim()) newErrors.motorizacao = 'Motorização é obrigatória';
    if (!formData.cambio) newErrors.cambio = 'Câmbio é obrigatório';
    if (!formData.cidade.trim()) newErrors.cidade = 'Cidade e Estado são obrigatórios';
    if (!formData.uso) newErrors.uso = 'Tipo de uso é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://webhook.automab.dev/webhook/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccessMessage('✓ Solicitação enviada com sucesso! Você receberá um orçamento em breve.');
        setFormData({
          nome: '',
          telefone: '',
          email: '',
          marca: '',
          modelo: '',
          ano: '',
          placa: '',
          cidade: '',
          motorizacao: '',
          cambio: '',
          uso: ''
        });
        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        setErrorMessage('Erro ao enviar o formulário. Tente novamente.');
      }
    } catch (error) {
      setErrorMessage('Erro na conexão. Verifique sua internet e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header with Logo */}
        <div className="text-center mb-12">
          <img 
            src={logo}
            alt="PROAUTO" 
            className="h-24 mx-auto mb-6"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Solicite seu Orçamento
          </h1>
          <p className="text-lg text-gray-600">
            Preencha os dados abaixo para receber uma proposta personalizada
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-green-800">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-800">{errorMessage}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          
          {/* Personal Information Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-600">
              Informações Pessoais
            </h2>
            
            <div className="space-y-5">
              {/* Nome */}
              <div>
                <label htmlFor="nome" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="João Silva"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition ${
                    errors.nome ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                  }`}
                />
                {errors.nome && <p className="text-red-600 text-sm mt-1">{errors.nome}</p>}
              </div>

              {/* Telefone e Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="telefone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="(13) 97827-6520"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition ${
                      errors.telefone ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                    }`}
                  />
                  {errors.telefone && <p className="text-red-600 text-sm mt-1">{errors.telefone}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu.email@exemplo.com"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition ${
                      errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                    }`}
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* Cidade */}
              <div>
                <label htmlFor="cidade" className="block text-sm font-semibold text-gray-700 mb-2">
                  Cidade e Estado *
                </label>
                <input
                  type="text"
                  id="cidade"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  placeholder="São Paulo, SP"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition ${
                    errors.cidade ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                  }`}
                />
                {errors.cidade && <p className="text-red-600 text-sm mt-1">{errors.cidade}</p>}
              </div>
            </div>
          </div>

          {/* Vehicle Information Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-600">
              Informações do Veículo
            </h2>

            <div className="space-y-5">
              {/* Marca, Modelo, Ano */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label htmlFor="marca" className="block text-sm font-semibold text-gray-700 mb-2">
                    Marca *
                  </label>
                  <input
                    type="text"
                    id="marca"
                    name="marca"
                    value={formData.marca}
                    onChange={handleChange}
                    placeholder="Toyota"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition ${
                      errors.marca ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                    }`}
                  />
                  {errors.marca && <p className="text-red-600 text-sm mt-1">{errors.marca}</p>}
                </div>

                <div>
                  <label htmlFor="modelo" className="block text-sm font-semibold text-gray-700 mb-2">
                    Modelo *
                  </label>
                  <input
                    type="text"
                    id="modelo"
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleChange}
                    placeholder="Corolla"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition ${
                      errors.modelo ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                    }`}
                  />
                  {errors.modelo && <p className="text-red-600 text-sm mt-1">{errors.modelo}</p>}
                </div>

                <div>
                  <label htmlFor="ano" className="block text-sm font-semibold text-gray-700 mb-2">
                    Ano de Fabricação *
                  </label>
                  <input
                    type="text"
                    id="ano"
                    name="ano"
                    value={formData.ano}
                    onChange={handleChange}
                    placeholder="2025"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition ${
                      errors.ano ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                    }`}
                  />
                  {errors.ano && <p className="text-red-600 text-sm mt-1">{errors.ano}</p>}
                </div>
              </div>

              {/* Placa */}
              <div>
                <label htmlFor="placa" className="block text-sm font-semibold text-gray-700 mb-2">
                  Placa do Veículo *
                </label>
                <input
                  type="text"
                  id="placa"
                  name="placa"
                  value={formData.placa}
                  onChange={handleChange}
                  placeholder="ABC1D23"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition uppercase ${
                    errors.placa ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                  }`}
                />
                {errors.placa && <p className="text-red-600 text-sm mt-1">{errors.placa}</p>}
              </div>

              {/* Motorização e Câmbio */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="motorizacao" className="block text-sm font-semibold text-gray-700 mb-2">
                    Motorização *
                  </label>
                  <input
                    type="text"
                    id="motorizacao"
                    name="motorizacao"
                    value={formData.motorizacao}
                    onChange={handleChange}
                    placeholder="1.6"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition ${
                      errors.motorizacao ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                    }`}
                  />
                  {errors.motorizacao && <p className="text-red-600 text-sm mt-1">{errors.motorizacao}</p>}
                </div>

                <div>
                  <label htmlFor="cambio" className="block text-sm font-semibold text-gray-700 mb-2">
                    Câmbio *
                  </label>
                  <select
                    id="cambio"
                    name="cambio"
                    value={formData.cambio}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition ${
                      errors.cambio ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                    }`}
                  >
                    <option value="">Selecione uma opção</option>
                    <option value="Manual">Manual</option>
                    <option value="Automático">Automático</option>
                  </select>
                  {errors.cambio && <p className="text-red-600 text-sm mt-1">{errors.cambio}</p>}
                </div>
              </div>

              {/* Uso */}
              <div>
                <label htmlFor="uso" className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo de Uso *
                </label>
                <select
                  id="uso"
                  name="uso"
                  value={formData.uso}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition ${
                    errors.uso ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <option value="">Selecione uma opção</option>
                  <option value="Passeio">Passeio</option>
                  <option value="Trabalho">Trabalho</option>
                </select>
                {errors.uso && <p className="text-red-600 text-sm mt-1">{errors.uso}</p>}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2 text-lg shadow-lg"
          >
            {loading ? (
              <>
                <Loader size={20} className="animate-spin" />
                Enviando...
              </>
            ) : (
              'Solicitar Orçamento'
            )}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            * Todos os campos são obrigatórios
          </p>
        </form>

        {/* Footer Info */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>Suas informações estão seguras conosco. Responderemos em breve.</p>
        </div>
      </div>
    </div>
  );
}