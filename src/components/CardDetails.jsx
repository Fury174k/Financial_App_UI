import React, { useState, useEffect, useRef } from 'react';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import { 
  CreditCardIcon, 
  PlusIcon, 
  EyeIcon, 
  EyeOffIcon,
  TrashIcon,
  PencilIcon,
  StarIcon,
  CheckCircleIcon,
  ShieldExclamationIcon
} from '@heroicons/react/outline';
import Alert from './Alert';

const CreditCardSection = ({ className }) => {
  const [cards, setCards] = useState([
    {
      id: 1,
      number: '4111111111111111',
      expiry: '12/28',
      cvc: '123',
      name: 'John Doe',
      issuer: 'visa',
      balance: 2500.00,
      limit: 5000.00,
      isDefault: true,
      lastUsed: '2024-01-15',
      status: 'active'
    },
    {
      id: 2,
      number: '5555555555554444',
      expiry: '06/27',
      cvc: '321',
      name: 'John Doe',
      issuer: 'mastercard',
      balance: 1200.50,
      limit: 3000.00,
      isDefault: false,
      lastUsed: '2024-01-10',
      status: 'active'
    }
  ]);

  const [focusedCard, setFocusedCard] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showDetails, setShowDetails] = useState({});
  const [animatingCard, setAnimatingCard] = useState(null);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [alert, setAlert] = useState({ message: '', type: 'info' });
  const cardRefs = useRef({});
  const creditCardRefs = useRef({});

  // New card form state
  const [newCard, setNewCard] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    focus: ''
  });

  // Enhanced animation states - separate for container and credit card
  const [cardStates, setCardStates] = useState({});

  useEffect(() => {
    // Initialize card animation states
    const initialStates = {};
    cards.forEach(card => {
      initialStates[card.id] = {
        isFlipped: false,
        containerHovered: false,
        creditCardHovered: false,
        // Container states (minimal)
        containerScale: 1,
        containerBoxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        // Credit card states (dramatic 3D effect)
        creditCardRotateX: 0,
        creditCardRotateY: 0,
        creditCardScale: 1,
        creditCardTranslateZ: 0,
        creditCardTranslateX: 0,
        creditCardTranslateY: 0,
        glowIntensity: 0
      };
    });
    setCardStates(initialStates);
  }, [cards]);

  // Container hover (subtle effects only)
  const handleContainerMouseEnter = (cardId) => {
    setCardStates(prev => ({
      ...prev,
      [cardId]: {
        ...prev[cardId],
        containerHovered: true,
        containerBoxShadow: '0 8px 15px -3px rgba(0, 0, 0, 0.12)'
      }
    }));
  };

  const handleContainerMouseLeave = (cardId) => {
    setCardStates(prev => ({
      ...prev,
      [cardId]: {
        ...prev[cardId],
        containerHovered: false,
        containerBoxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }
    }));
  };

  // Credit card specific 3D effect: activate on click, deactivate on next click
  const toggleCreditCard3D = (cardId) => {
    setCardStates(prev => {
      const isActive = prev[cardId]?.creditCardHovered;
      return {
        ...prev,
        [cardId]: {
          ...prev[cardId],
          creditCardHovered: !isActive,
          creditCardRotateX: !isActive ? 10 : 0, // Example tilt
          creditCardRotateY: !isActive ? 15 : 0, // Example tilt
          creditCardScale: !isActive ? 1.4 : 1,
          creditCardTranslateZ: !isActive ? 80 : 0,
          creditCardTranslateX: 0,
          creditCardTranslateY: 0,
          glowIntensity: !isActive ? 1 : 0
        }
      };
    });
  };

  // Card flip animation
  const flipCard = (cardId) => {
    setCardStates(prev => ({
      ...prev,
      [cardId]: {
        ...prev[cardId],
        isFlipped: !prev[cardId].isFlipped
      }
    }));
  };

  // Toggle card details visibility with stagger animation
  const toggleCardDetails = (cardId) => {
    setShowDetails(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
    
    // Add a subtle bounce animation
    setAnimatingCard(cardId);
    setTimeout(() => setAnimatingCard(null), 300);
  };

  // Set default card with animation
  const setDefaultCard = (cardId) => {
    setCards(prev => prev.map(card => ({
      ...card,
      isDefault: card.id === cardId
    })));
    
    // Pulse animation for the selected card
    setCardStates(prev => ({
      ...prev,
      [cardId]: {
        ...prev[cardId],
        containerScale: 1.05
      }
    }));
    
    setTimeout(() => {
      setCardStates(prev => ({
        ...prev,
        [cardId]: {
          ...prev[cardId],
          containerScale: 1
        }
      }));
    }, 200);
  };

  // Calculate utilization percentage
  const getUtilization = (balance, limit) => {
    return (balance / limit) * 100;
  };

  // Get utilization color
  const getUtilizationColor = (utilization) => {
    if (utilization >= 80) return 'text-red-600 bg-red-100';
    if (utilization >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  // Handle new card input
  const handleNewCardInput = (e) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    // Format card number
    if (name === 'number') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    }
    
    // Format expiry
    if (name === 'expiry') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
    }
    
    // Format CVC
    if (name === 'cvc') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setNewCard(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  // Handle input focus for card preview
  const handleInputFocus = (field) => {
    setNewCard(prev => ({
      ...prev,
      focus: field
    }));
  };

  return (
    <div className={`${className} bg-white p-4 rounded-xl shadow-sm border border-gray-100`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <CreditCardIcon className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Payment Cards</h2>
            <p className="text-sm text-gray-500">{cards.length} cards • ${cards.reduce((sum, card) => sum + card.balance, 0).toFixed(2)} total balance</p>
          </div>
        </div>
        
        <button
          onClick={() => setIsAddingCard(!isAddingCard)}
          className="flex items-center px-4 py-2 space-x-2 text-white transition-all duration-200 transform bg-indigo-600 rounded-lg hover:bg-indigo-700 hover:scale-105 active:scale-95"
        >
          <PlusIcon className="w-4 h-4" />
          <span className="text-sm font-medium">Add Card</span>
        </button>
      </div>

      {/* Add New Card Section as Popup */}
      {isAddingCard && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300" onClick={() => setIsAddingCard(false)} />
          {/* Popup */}
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="w-full max-w-2xl p-6 border border-indigo-100 bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl shadow-2xl animate-in slide-in-from-top-4 relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-indigo-600 text-xl font-bold focus:outline-none"
                onClick={() => setIsAddingCard(false)}
                aria-label="Close add card popup"
              >
                &times;
              </button>
              <h3 className="mb-4 text-lg font-semibold text-gray-800">Add New Card</h3>
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Card Preview */}
                <div className="flex justify-center">
                  <div className="transition-all duration-300 transform hover:scale-105">
                    <Cards
                      number={newCard.number}
                      expiry={newCard.expiry}
                      cvc={newCard.cvc}
                      name={newCard.name}
                      focused={newCard.focus}
                      placeholders={{ name: 'YOUR NAME HERE' }}
                    />
                  </div>
                </div>
                {/* Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Card Number</label>
                    <input
                      type="text"
                      name="number"
                      placeholder="1234 5678 9012 3456"
                      value={newCard.number}
                      onChange={handleNewCardInput}
                      onFocus={() => handleInputFocus('number')}
                      maxLength={19}
                      className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Expiry Date</label>
                      <input
                        type="text"
                        name="expiry"
                        placeholder="MM/YY"
                        value={newCard.expiry}
                        onChange={handleNewCardInput}
                        onFocus={() => handleInputFocus('expiry')}
                        maxLength={5}
                        className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">CVC</label>
                      <input
                        type="text"
                        name="cvc"
                        placeholder="123"
                        value={newCard.cvc}
                        onChange={handleNewCardInput}
                        onFocus={() => handleInputFocus('cvc')}
                        maxLength={4}
                        className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Cardholder Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={newCard.name}
                      onChange={handleNewCardInput}
                      onFocus={() => handleInputFocus('name')}
                      className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex pt-4 space-x-3">
                    <button
                      onClick={() => setIsAddingCard(false)}
                      className="flex-1 px-4 py-3 text-gray-700 transition-all duration-200 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => setAlert({ message: 'Adding new cards is currently disabled.', type: 'info' })}
                      className="flex-1 px-4 py-3 text-white transition-all duration-200 transform bg-indigo-600 rounded-lg hover:bg-indigo-700 hover:scale-105 active:scale-95"
                    >
                      Add Card
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Cards Grid - Container has overflow visible to allow card expansion */}
      <div 
        className="grid grid-cols-1 gap-16 lg:grid-cols-2 xl:grid-cols-3"
        style={{ perspective: '1500px' }}
      >
        {cards.map((card, index) => {
          const utilization = getUtilization(card.balance, card.limit);
          const state = cardStates[card.id] || {};
          
          return (
            <div
              key={card.id}
              ref={el => cardRefs.current[card.id] = el}
              className="relative group"
              style={{
                // Container only has minimal scaling, no rotation
                transform: `scale3d(${state.containerScale || 1}, ${state.containerScale || 1}, ${state.containerScale || 1})`,
                transition: 'all 0.3s ease-out',
                zIndex: state.creditCardHovered ? 50 : 1,
                // Ensure container doesn't clip the expanding card
                overflow: 'visible'
              }}
              onMouseEnter={() => handleContainerMouseEnter(card.id)}
              onMouseLeave={() => handleContainerMouseLeave(card.id)}
            >
              {/* Card Container - No pointer events to avoid interfering with credit card hover */}
              <div className={`
                relative p-6 rounded-xl border-2 transition-all duration-300 overflow-visible
                ${selectedCard === card.id 
                  ? 'border-indigo-400 bg-indigo-50' 
                  : 'border-gray-100 bg-white hover:border-indigo-200'
                }
                ${animatingCard === card.id ? 'animate-bounce' : ''}
                ${state.containerHovered ? 'bg-gradient-to-br from-white to-indigo-50/30' : ''}
              `}
              style={{
                boxShadow: state.containerBoxShadow,
                // Ensure container doesn't limit card growth
                overflow: 'visible'
              }}>
                
                {/* Animated background pattern */}
                {state.containerHovered && (
                  <div className="absolute inset-0 opacity-10 rounded-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 animate-pulse rounded-xl" />
                    <div className="absolute inset-0 bg-gradient-to-tl from-blue-500/10 via-cyan-500/10 to-teal-500/10 animate-pulse rounded-xl" style={{ animationDelay: '0.5s' }} />
                  </div>
                )}
                
                {/* Default Card Badge */}
                {card.isDefault && (
                  <div className="absolute z-10 -top-2 -right-2">
                    <div className="flex items-center px-2 py-1 space-x-1 text-xs font-medium text-white bg-green-500 rounded-full animate-pulse">
                      <StarIcon className="w-3 h-3" />
                      <span>Default</span>
                    </div>
                  </div>
                )}

                {/* Credit Card Container - This is where the 3D magic happens */}
                <div className="relative flex justify-center mb-4" style={{ 
                  perspective: '1200px',
                  // Ensure this container doesn't clip the card
                  overflow: 'visible',
                  // Add padding to accommodate the expanded card
                  padding: '40px 20px'
                }}>
                  
                  {/* Glow Effect - positioned behind the card */}
                  {state.glowIntensity > 0 && (
                    <div 
                      className="absolute pointer-events-none"
                      style={{
                        top: '50%',
                        left: '50%',
                        width: '300px',
                        height: '200px',
                        transform: 'translate(-50%, -50%) translateZ(-10px)',
                        background: `radial-gradient(ellipse at center, rgba(99, 102, 241, ${state.glowIntensity * 0.6}) 0%, rgba(168, 85, 247, ${state.glowIntensity * 0.4}) 35%, transparent 70%)`,
                        filter: 'blur(30px)',
                        opacity: state.glowIntensity,
                        borderRadius: '50%',
                        animation: 'pulse 2s infinite'
                      }}
                    />
                  )}
                  
                  <div 
                    ref={el => creditCardRefs.current[card.id] = el}
                    className="transition-all duration-700 transform cursor-pointer"
                    onClick={() => { flipCard(card.id); toggleCreditCard3D(card.id); }}
                    // Remove onMouseMove, onMouseEnter, onMouseLeave for 3D effect
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: `
                        ${state.isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'}
                        scale3d(${state.creditCardScale}, ${state.creditCardScale}, ${state.creditCardScale})
                        translateZ(${state.creditCardTranslateZ}px)
                        rotateX(${state.creditCardRotateX + (state.isFlipped ? 0 : 0)}deg)
                        rotateY(${state.creditCardRotateY + (state.isFlipped ? 180 : 0)}deg)
                        translateX(${state.creditCardTranslateX}px)
                        translateY(${state.creditCardTranslateY}px)
                      `,
                      filter: state.creditCardHovered ? 'drop-shadow(0 35px 50px rgba(0, 0, 0, 0.4))' : 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.12))',
                      zIndex: state.creditCardHovered ? 100 : 10,
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                  >
                    <Cards
                      number={card.number}
                      expiry={card.expiry}
                      cvc={card.cvc}
                      name={card.name}
                      focused={focusedCard === card.id ? 'cvc' : ''}
                      preview={true}
                      issuer={card.issuer}
                    />
                  </div>
                </div>

                {/* Card Info */}
                <div className="space-y-3">
                  {/* Card Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        card.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                      } ${state.containerHovered ? 'animate-pulse' : ''}`}></div>
                      <span className="text-sm font-medium text-gray-700">
                        **** {card.number.slice(-4)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => toggleCardDetails(card.id)}
                        className={`p-1 text-gray-400 transition-all duration-200 hover:text-indigo-600 ${
                          state.containerHovered ? 'scale-110' : ''
                        }`}
                        title="Toggle details"
                      >
                        {showDetails[card.id] ? 
                          <EyeOffIcon className="w-4 h-4" /> : 
                          <EyeIcon className="w-4 h-4" />
                        }
                      </button>
                      
                      <button
                        onClick={() => setDefaultCard(card.id)}
                        className={`p-1 transition-all duration-200 ${
                          card.isDefault 
                            ? 'text-yellow-500' 
                            : 'text-gray-400 hover:text-yellow-500'
                        } ${state.containerHovered ? 'scale-110' : ''}`}
                        title="Set as default"
                      >
                        <StarIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Balance & Utilization */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Balance</span>
                      <span className={`text-lg font-semibold text-gray-800 transition-all duration-200 ${
                        state.containerHovered ? 'text-indigo-700 scale-105' : ''
                      }`}>
                        ${card.balance.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Limit</span>
                      <span className="text-sm text-gray-600">
                        ${card.limit.toFixed(2)}
                      </span>
                    </div>
                    
                    {/* Utilization Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Utilization</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getUtilizationColor(utilization)} ${
                          state.containerHovered ? 'scale-105' : ''
                        } transition-transform duration-200`}>
                          {utilization.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            utilization >= 80 ? 'bg-red-500' :
                            utilization >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                          } ${state.containerHovered ? 'animate-pulse' : ''}`}
                          style={{ width: `${Math.min(utilization, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {showDetails[card.id] && (
                  <div className="pt-4 mt-4 duration-300 border-t border-gray-200 animate-in slide-in-from-top-2">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-gray-500">Last Used</span>
                        <p className="font-medium text-gray-800">
                          {new Date(card.lastUsed).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Expires</span>
                        <p className="font-medium text-gray-800">{card.expiry}</p>
                      </div>
                    </div>
                    
                    <div className="flex mt-4 space-x-2">
                      <button className="flex-1 px-3 py-2 text-xs text-gray-700 transition-colors duration-200 bg-gray-100 rounded-lg hover:bg-gray-200">
                        <PencilIcon className="inline w-3 h-3 mr-1" />
                        Edit
                      </button>
                      <button className="flex-1 px-3 py-2 text-xs text-red-700 transition-colors duration-200 bg-red-100 rounded-lg hover:bg-red-200">
                        <TrashIcon className="inline w-3 h-3 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-3">
        <div className="p-4 border border-green-200 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-600">Available Credit</p>
              <p className="text-lg font-semibold text-green-800">
                ${cards.reduce((sum, card) => sum + (card.limit - card.balance), 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-4 border border-blue-200 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <CreditCardIcon className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-600">Total Limit</p>
              <p className="text-lg font-semibold text-blue-800">
                ${cards.reduce((sum, card) => sum + card.limit, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-4 border rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <div className="flex items-center space-x-3">
            <ShieldExclamationIcon className="w-8 h-8 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-600">Avg Utilization</p>
              <p className="text-lg font-semibold text-amber-800">
                {cards.length > 0 
                  ? (cards.reduce((sum, card) => sum + getUtilization(card.balance, card.limit), 0) / cards.length).toFixed(1)
                  : 0
                }%
              </p>
            </div>
          </div>
        </div>
      </div>

      <Alert
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ message: '', type: 'info' })}
        enableSound={true}
        enableAnimation={true}
        position="top-center"
        duration={2500}
      />
    </div>
  );
};

export default CreditCardSection;