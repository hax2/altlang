// Spanish Learning Data - Organized by Regions with Sentences

const REGIONS = {
  basics: {
    name: 'Básicos',
    emoji: '🌟',
    color: '#F87171',
    category: 'Fundamentos',
    description: 'Essential phrases for everyday communication - Use these when you need to be polite, ask for help, or express basic needs in any situation.',
    flashcards: [
      { 
        front: 'Sí, por favor.', 
        back: 'Yes, please.',
        context: 'Use when agreeing to something politely, like accepting a drink or an offer.',
        grammar: 'Sí = Yes, por favor = please (polite request marker)',
        breakdown: { 'Sí': 'Yes', 'por': 'for', 'favor': 'favor', 'por favor': 'please' }
      },
      { 
        front: 'No, gracias.', 
        back: 'No, thank you.',
        context: 'Use when politely declining something, like more food or a sales offer.',
        grammar: 'No = No, gracias = thank you (polite decline)',
        breakdown: { 'No': 'No', 'gracias': 'thank you' }
      },
      { 
        front: 'Por favor, ayúdame.', 
        back: 'Please help me.',
        context: 'A direct request for assistance when you are in need.',
        grammar: 'Imperative form: ayúdame = help me (command)',
        breakdown: { 'Por favor': 'please', 'ayúda': 'help (imperative)', 'me': 'me', 'ayúdame': 'help me' }
      },
      { 
        front: 'Gracias por tu ayuda.', 
        back: 'Thank you for your help.',
        context: 'Use to express gratitude after someone has assisted you.',
        grammar: 'Gracias por + noun = Thank you for + noun',
        breakdown: { 'Gracias': 'thank you', 'por': 'for', 'tu': 'your (informal)', 'ayuda': 'help (noun)' }
      },
      { 
        front: 'De nada, es un placer.', 
        back: "You're welcome, it's a pleasure.",
        context: 'A warm response to "thank you," implying you enjoyed helping.',
        grammar: 'De nada = You\'re welcome, es = is (ser verb)',
        breakdown: { 'De nada': "you're welcome", 'es': 'is', 'un': 'a', 'placer': 'pleasure' }
      },
      {
        front: 'Lo siento mucho.',
        back: "I'm very sorry.",
        context: 'Use to apologize sincerely for a mistake or a sad event.',
        grammar: 'Lo siento = I feel it (common way to say sorry)',
        breakdown: { 'Lo': 'it', 'siento': 'I feel', 'mucho': 'very/a lot' }
      },
      {
        front: 'No entiendo.',
        back: "I don't understand.",
        context: 'Essential phrase when you don\'t comprehend what someone said.',
        grammar: 'No = negation, entiendo = I understand (entender verb)',
        breakdown: { 'No': 'not', 'entiendo': 'I understand' }
      },
      {
        front: '¿Puede repetir, por favor?',
        back: 'Can you repeat, please? (formal)',
        context: 'Use when you need someone to say something again, addressing them formally.',
        grammar: 'Puede = Can you (formal, poder verb), repetir = to repeat',
        breakdown: { '¿Puede': 'Can you (formal)', 'repetir': 'to repeat', 'por favor?': 'please?' }
      },
      {
        front: '¿Hablas inglés?',
        back: 'Do you speak English? (informal)',
        context: 'Use when asking a peer if they can communicate in English.',
        grammar: 'Hablas = you speak (hablar verb, tú form)',
        breakdown: { '¿Hablas': 'Do you speak', 'inglés?': 'English?' }
      }
    ]
  },
  greetings: {
    name: 'Saludos',
    emoji: '👋',
    color: '#F59E0B',
    category: 'Fundamentos',
    description: 'Greetings and introductions - Use these when meeting people, starting conversations, or being polite in social situations.',
    flashcards: [
      { 
        front: '¡Hola! ¿Cómo estás?', 
        back: 'Hello! How are you? (informal)',
        context: 'A friendly, common greeting for friends, family, or peers.',
        grammar: '¿Cómo estás? = How are you? (estar verb, tú form)',
        breakdown: { '¡Hola!': 'Hello!', '¿Cómo': 'How', 'estás': 'are you (informal)' }
      },
      { 
        front: 'Buenos días, señora.', 
        back: 'Good morning, ma\'am.',
        context: 'A formal and polite morning greeting.',
        grammar: 'Buenos días = Good morning',
        breakdown: { 'Buenos': 'good', 'días': 'days', 'señora': 'ma\'am/Mrs.' }
      },
      {
        front: 'Buenas tardes.',
        back: 'Good afternoon.',
        context: 'A standard greeting used from midday until the evening.',
        grammar: 'Plural adjective + noun greeting.',
        breakdown: { 'Buenas': 'good', 'tardes': 'afternoons' }
      },
      {
        front: 'Buenas noches.',
        back: 'Good evening / Good night.',
        context: 'Used both as a greeting in the evening and to say goodbye before bed.',
        grammar: 'Plural adjective + noun greeting.',
        breakdown: { 'Buenas': 'good', 'noches': 'nights' }
      },
      { 
        front: 'Mucho gusto en conocerte.', 
        back: 'Nice to meet you.',
        context: 'A standard and friendly phrase when first introduced to someone.',
        grammar: 'Mucho gusto = a lot of pleasure, en conocerte = in meeting you',
        breakdown: { 'Mucho': 'much', 'gusto': 'pleasure', 'en': 'in', 'conocerte': 'meeting you' }
      },
      {
        front: 'Me llamo...',
        back: 'My name is...',
        context: 'Use to introduce yourself.',
        grammar: 'Literally "I call myself..."',
        breakdown: { 'Me': 'myself', 'llamo': 'I call' }
      },
      {
        front: 'Hasta luego.',
        back: 'See you later.',
        context: 'A common way to say goodbye when you expect to see the person again.',
        grammar: 'Hasta = until, luego = later',
        breakdown: { 'Hasta': 'until', 'luego': 'later' }
      },
      {
        front: 'Nos vemos más tarde.',
        back: 'See you later.',
        context: 'Another way to say goodbye, literally meaning "we see each other later".',
        grammar: 'Nos vemos = we see each other (reflexive)',
        breakdown: { 'Nos': 'us', 'vemos': 'we see', 'más tarde': 'later', 'más': 'more', 'tarde': 'late' }
      },
      {
        front: 'Adiós, que te vaya bien.',
        back: 'Goodbye, take care. / I hope it goes well for you.',
        context: 'A warm and kind way to say goodbye.',
        grammar: 'Que te vaya bien = Subjunctive mood wishing someone well.',
        breakdown: { 'Adiós': 'Goodbye', 'que': 'that', 'te': 'to you', 'vaya': 'it goes (subjunctive)', 'bien': 'well' }
      }
    ]
  },
  travel: {
    name: 'Viaje',
    emoji: '✈️',
    color: '#10B981',
    category: 'Situaciones',
    description: 'Travel and transportation vocabulary - Use these when navigating airports, train stations, hotels, and asking for directions while traveling.',
    flashcards: [
      { 
        front: '¿Dónde está la estación de tren?', 
        back: 'Where is the train station?',
        context: 'Use when looking for the train station in a new city.',
        grammar: '¿Dónde está? = Where is? (for location)',
        breakdown: { '¿Dónde': 'Where', 'está': 'is', 'la': 'the', 'estación': 'station', 'de': 'of', 'tren': 'train' }
      },
      { 
        front: 'Quisiera un boleto para Madrid.', 
        back: 'I would like a ticket to Madrid.',
        context: 'A polite way to request a ticket at a counter.',
        grammar: 'Quisiera = I would like (conditional tense of querer)',
        breakdown: { 'Quisiera': 'I would like', 'un': 'a', 'boleto': 'ticket', 'para': 'for/to', 'Madrid': 'Madrid' }
      },
      {
        front: '¿A qué hora sale el próximo avión?',
        back: 'What time does the next plane leave?',
        context: 'Use at the airport to ask about departure times.',
        grammar: '¿A qué hora? = At what time?, sale = it leaves (salir verb)',
        breakdown: { '¿A qué hora': 'At what time', 'sale': 'leaves', 'el': 'the', 'próximo': 'next', 'avión?': 'plane?' }
      },
      {
        front: 'Tengo una reservación a nombre de...',
        back: 'I have a reservation under the name of...',
        context: 'Use when checking into a hotel.',
        grammar: 'Tengo = I have (tener verb), a nombre de = under the name of',
        breakdown: { 'Tengo': 'I have', 'una': 'a', 'reservación': 'reservation', 'a nombre de': 'under the name of...' }
      },
      {
        front: '¿Cuánto cuesta un taxi al centro?',
        back: 'How much does a taxi to the downtown cost?',
        context: 'Asking a taxi driver for a fare estimate.',
        grammar: '¿Cuánto cuesta? = How much does it cost?',
        breakdown: { '¿Cuánto': 'How much', 'cuesta': 'does it cost', 'un': 'a', 'taxi': 'taxi', 'al': 'to the', 'centro?': 'downtown?' }
      },
      {
        front: 'El viaje fue muy largo.',
        back: 'The trip was very long.',
        context: 'Commenting on the duration of a journey.',
        grammar: 'Fue = was (ser verb, preterite tense)',
        breakdown: { 'El': 'the', 'viaje': 'trip', 'fue': 'was', 'muy': 'very', 'largo': 'long' }
      }
    ]
  },
  food: {
    name: 'Comida',
    emoji: '🍽️',
    color: '#3B82F6',
    category: 'Situaciones',
    description: 'Food and dining vocabulary - Use these in restaurants, cafes, and when discussing food preferences or dietary needs.',
    flashcards: [
      { 
        front: 'La cuenta, por favor.', 
        back: 'The check, please.',
        context: 'The most common way to ask for the bill in a restaurant.',
        grammar: 'La cuenta = The bill/check',
        breakdown: { 'La': 'the', 'cuenta': 'check/bill', 'por favor': 'please' }
      },
      { 
        front: '¿Qué me recomienda?', 
        back: 'What do you recommend?',
        context: 'Ask the waiter for their suggestion on what to order.',
        grammar: 'Recomienda = you recommend (recomendar verb, usted form)',
        breakdown: { '¿Qué': 'What', 'me': 'to me', 'recomienda?': 'do you recommend?' }
      },
      {
        front: 'Soy alérgico/a a los frutos secos.',
        back: 'I am allergic to nuts.',
        context: 'Crucial phrase to communicate a food allergy. Use "alérgico" for male, "alérgica" for female.',
        grammar: 'Soy = I am (ser verb), alérgico/a = allergic',
        breakdown: { 'Soy': 'I am', 'alérgico/a': 'allergic', 'a': 'to', 'los': 'the', 'frutos secos': 'nuts' }
      },
      {
        front: 'Voy a llegar más tarde de lo normal.',
        back: 'I am going to arrive later than usual.',
        context: 'Informing someone that you will be delayed.',
        grammar: 'Voy a + infinitive = I am going to (near future)',
        breakdown: { 'Voy a': 'I am going to', 'llegar': 'arrive', 'más tarde': 'later', 'de lo normal': 'than usual', 'más': 'more', 'tarde': 'late', 'de': 'of', 'lo': 'the', 'normal': 'normal' }
      },
      {
        front: '¡La comida estuvo deliciosa!',
        back: 'The food was delicious!',
        context: 'A compliment to the chef or host after a meal.',
        grammar: 'Estuvo = was (estar verb, preterite tense)',
        breakdown: { '¡La': 'The', 'comida': 'food', 'estuvo': 'was', 'deliciosa!': 'delicious!' }
      },
      {
        front: 'Quisiera una mesa para dos personas.',
        back: 'I would like a table for two people.',
        context: 'Use when arriving at a restaurant to request a table.',
        grammar: 'Quisiera = I would like (conditional)',
        breakdown: { 'Quisiera': 'I would like', 'una': 'a', 'mesa': 'table', 'para': 'for', 'dos': 'two', 'personas': 'people' }
      },
      { 
        front: 'Tengo hambre, ¿dónde podemos comer?', 
        back: "I'm hungry, where can we eat?",
        context: 'Expressing hunger and asking for suggestions on where to eat.',
        grammar: 'Tengo hambre = I have hunger (idiomatic expression)',
        breakdown: { 'Tengo hambre': "I'm hungry", '¿dónde': 'where', 'podemos': 'can we', 'comer?': 'to eat?' }
      }
    ]
  },
  shopping: {
    name: 'Compras',
    emoji: '🛍️',
    color: '#8B5CF6',
    category: 'Situaciones',
    description: 'Shopping and commerce vocabulary - Use these in stores, markets, and when making purchases or asking about products.',
    flashcards: [
      { 
        front: '¿Cuánto cuesta esto?', 
        back: 'How much does this cost?',
        context: 'The simplest way to ask for the price of an item.',
        grammar: '¿Cuánto cuesta? = How much does it cost?',
        breakdown: { '¿Cuánto': 'How much', 'cuesta': 'does it cost', 'esto?': 'this?' }
      },
      { 
        front: '¿Aceptan tarjetas de crédito?', 
        back: 'Do you accept credit cards?',
        context: 'A common question before paying for goods or services.',
        grammar: '¿Aceptan? = Do you (plural/formal) accept?',
        breakdown: { '¿Aceptan': 'Do you accept', 'tarjetas': 'cards', 'de': 'of', 'crédito?': 'credit?' }
      },
      {
        front: 'Solo estoy mirando, gracias.',
        back: "I'm just looking, thank you.",
        context: 'A polite way to respond to a salesperson offering help.',
        grammar: 'Estoy mirando = I am looking (present continuous)',
        breakdown: { 'Solo': 'only/just', 'estoy': 'I am', 'mirando': 'looking', 'gracias': 'thank you' }
      },
      {
        front: '¿Puedo probármelo?',
        back: 'Can I try it on?',
        context: 'Use in a clothing store when you want to try on an item.',
        grammar: 'Puedo = Can I (poder verb), probármelo = to try it on myself',
        breakdown: { '¿Puedo': 'Can I', 'probar': 'to try', 'me': 'myself', 'lo': 'it', 'probármelo?': 'try it on?' }
      },
      {
        front: '¿Tiene esto en una talla más grande/pequeña?',
        back: 'Do you have this in a bigger/smaller size?',
        context: 'Asking for a different size of a clothing item.',
        grammar: 'Tiene = Do you have (formal)',
        breakdown: { '¿Tiene': 'Do you have', 'esto': 'this', 'en': 'in', 'una talla': 'a size', 'más': 'more', 'grande/pequeña?': 'big/small?' }
      },
      {
        front: 'Lo llevo.',
        back: "I'll take it.",
        context: 'A simple phrase to confirm you are buying an item.',
        grammar: 'Lo = it, llevo = I take (llevar verb)',
        breakdown: { 'Lo': 'it', 'llevo': "I'll take" }
      }
    ]
  },
  directions: {
    name: 'Direcciones',
    emoji: '🧭',
    color: '#0EA5E9',
    category: 'Situaciones',
    description: 'Navigating and asking for directions - Use these phrases when you are lost or trying to find a specific location.',
    flashcards: [
      {
        front: 'Estoy perdido/a. ¿Me puede ayudar?',
        back: "I'm lost. Can you help me?",
        context: 'The essential first phrase when you need help with directions. Use "perdido" for male, "perdida" for female.',
        grammar: 'Estoy = I am (location/state), perdido/a = lost',
        breakdown: { 'Estoy': 'I am', 'perdido/a': 'lost', '¿Me puede': 'Can you', 'ayudar?': 'help me?' }
      },
      {
        front: 'Siga todo recto por dos cuadras.',
        back: 'Go straight ahead for two blocks.',
        context: 'Understanding a common direction given by locals.',
        grammar: 'Siga = Go (imperative, usted form), recto = straight',
        breakdown: { 'Siga': 'Go (formal)', 'todo recto': 'straight ahead', 'por': 'for', 'dos': 'two', 'cuadras': 'blocks' }
      },
      {
        front: 'Gire a la derecha en el próximo semáforo.',
        back: 'Turn right at the next traffic light.',
        context: 'A specific instruction for turning.',
        grammar: 'Gire = Turn (imperative, usted form)',
        breakdown: { 'Gire': 'Turn (formal)', 'a la derecha': 'to the right', 'en el': 'at the', 'próximo': 'next', 'semáforo': 'traffic light' }
      },
      {
        front: '¿Cómo llego al museo?',
        back: 'How do I get to the museum?',
        context: 'A direct question to ask for directions to a place.',
        grammar: '¿Cómo llego? = How do I arrive? (llegar verb)',
        breakdown: { '¿Cómo': 'How', 'llego': 'do I get/arrive', 'al': 'to the', 'museo?': 'museum?' }
      },
      {
        front: 'Está a la vuelta de la esquina.',
        back: "It's just around the corner.",
        context: 'A common response indicating something is very close.',
        grammar: 'Está = It is (location)',
        breakdown: { 'Está': 'It is', 'a la vuelta de': 'around', 'la esquina': 'the corner' }
      }
    ]
  },
  weather: {
    name: 'El Clima',
    emoji: '🌤️',
    color: '#F472B6',
    category: 'Conversación',
    description: 'Talking about the weather - Use these common phrases to describe or ask about meteorological conditions.',
    flashcards: [
      {
        front: '¿Qué tiempo hace hoy?',
        back: "What's the weather like today?",
        context: 'The most common way to ask about the weather.',
        grammar: 'Hace tiempo = it makes weather (idiomatic)',
        breakdown: { '¿Qué': 'What', 'tiempo': 'weather', 'hace': 'does it do/make', 'hoy?': 'today?' }
      },
      {
        front: 'Hace mucho calor.',
        back: "It's very hot.",
        context: 'Describing a hot day.',
        grammar: 'Hacer verb is used for general weather conditions.',
        breakdown: { 'Hace': 'It is', 'mucho': 'a lot of', 'calor': 'heat' }
      },
      {
        front: 'Está lloviendo.',
        back: "It's raining.",
        context: 'Describing current precipitation.',
        grammar: 'Estar + gerund (present progressive) for ongoing actions.',
        breakdown: { 'Está': 'It is', 'lloviendo': 'raining' }
      },
      {
        front: 'Mañana va a estar soleado.',
        back: 'Tomorrow is going to be sunny.',
        context: 'Talking about the weather forecast for the next day.',
        grammar: 'Ir + a + infinitive for the near future.',
        breakdown: { 'Mañana': 'Tomorrow', 'va a estar': 'is going to be', 'soleado': 'sunny' }
      },
      {
        front: 'Hay nubes pero no llueve.',
        back: "It's cloudy but it's not raining.",
        context: 'Describing an overcast day without rain.',
        grammar: 'Hay = There is/are, no llueve = it does not rain',
        breakdown: { 'Hay': 'There are', 'nubes': 'clouds', 'pero': 'but', 'no': 'not', 'llueve': 'it rains' }
      }
    ]
  },
  health: {
    name: 'Salud',
    emoji: '🏥',
    color: '#14B8A6',
    category: 'Situaciones',
    description: 'Health and medical vocabulary - Use these when visiting doctors, pharmacies, or describing health problems.',
    flashcards: [
      { 
        front: 'Me duele la cabeza.', 
        back: 'My head hurts. / I have a headache.',
        context: 'A common way to describe pain to a doctor or friend.',
        grammar: 'Doler verb structure: (indirect object) + duele/duelen + (body part)',
        breakdown: { 'Me': 'to me', 'duele': 'it hurts', 'la': 'the', 'cabeza': 'head' }
      },
      {
        front: 'Necesito una cita con el doctor.',
        back: 'I need an appointment with the doctor.',
        context: 'Use when calling a clinic or hospital to schedule a visit.',
        grammar: 'Necesito = I need (necesitar verb)',
        breakdown: { 'Necesito': 'I need', 'una': 'an', 'cita': 'appointment', 'con': 'with', 'el': 'the', 'doctor': 'doctor' }
      },
      {
        front: 'Tengo fiebre y tos.',
        back: 'I have a fever and a cough.',
        context: 'Describing common symptoms of illness.',
        grammar: 'Tener verb is used for symptoms.',
        breakdown: { 'Tengo': 'I have', 'fiebre': 'fever', 'y': 'and', 'tos': 'cough' }
      },
      { 
        front: '¿Dónde está la farmacia más cercana?', 
        back: 'Where is the nearest pharmacy?',
        context: 'Asking for the location of a pharmacy to buy medicine.',
        grammar: 'más cercana = nearest (superlative)',
        breakdown: { '¿Dónde está': 'Where is', 'la': 'the', 'farmacia': 'pharmacy', 'más': 'most', 'cercana?': 'near?' }
      },
      {
        front: 'Me siento mareado/a.',
        back: 'I feel dizzy.',
        context: 'Describing a feeling of dizziness or lightheadedness. Use "mareado" for male, "mareada" for female.',
        grammar: 'Me siento = I feel (sentirse verb, reflexive)',
        breakdown: { 'Me': 'myself', 'siento': 'I feel', 'mareado/a': 'dizzy' }
      }
    ]
  },
  family: {
    name: 'Familia',
    emoji: '👨‍👩‍👧‍👦',
    color: '#A78BFA',
    category: 'Conversación',
    description: 'Talking about family - Phrases to introduce, describe, and ask about family members.',
    flashcards: [
        {
            front: 'Esta es mi familia.',
            back: 'This is my family.',
            context: 'Introducing your family to someone.',
            grammar: 'Esta = This (feminine demonstrative pronoun)',
            breakdown: { 'Esta': 'This', 'es': 'is', 'mi': 'my', 'familia': 'family' }
        },
        {
            front: 'Tengo dos hermanos y una hermana.',
            back: 'I have two brothers and one sister.',
            context: 'Describing your siblings.',
            grammar: 'Tengo = I have (tener verb)',
            breakdown: { 'Tengo': 'I have', 'dos': 'two', 'hermanos': 'brothers', 'y': 'and', 'una': 'one', 'hermana': 'sister' }
        },
        {
            front: 'Mis padres viven en México.',
            back: 'My parents live in Mexico.',
            context: 'Sharing where your parents reside.',
            grammar: 'Mis = my (plural), viven = they live (vivir verb)',
            breakdown: { 'Mis': 'My', 'padres': 'parents', 'viven': 'they live', 'en': 'in', 'México': 'Mexico' }
        },
        {
            front: '¿Cuántos años tiene tu abuelo?',
            back: 'How old is your grandfather?',
            context: 'Asking about the age of a family member.',
            grammar: '¿Cuántos años tiene? = How many years does he/she have? (idiomatic for age)',
            breakdown: { '¿Cuántos': 'How many', 'años': 'years', 'tiene': 'does he have', 'tu': 'your', 'abuelo?': 'grandfather?' }
        },
        {
            front: 'Mi esposa es abogada.',
            back: 'My wife is a lawyer.',
            context: 'Describing your spouse\'s profession. Note: no "una" before professions.',
            grammar: 'Ser + profession (no article needed)',
            breakdown: { 'Mi': 'My', 'esposa': 'wife', 'es': 'is', 'abogada': 'lawyer' }
        }
    ]
  },
  hobbies: {
    name: 'Pasatiempos',
    emoji: '🎨',
    color: '#FB923C',
    category: 'Conversación',
    description: 'Discussing hobbies and leisure activities - What you like to do in your free time.',
    flashcards: [
        {
            front: 'En mi tiempo libre, me gusta leer.',
            back: 'In my free time, I like to read.',
            context: 'Sharing one of your hobbies.',
            grammar: 'Me gusta + infinitive = I like to (do something)',
            breakdown: { 'En': 'In', 'mi': 'my', 'tiempo libre': 'free time', 'me gusta': 'I like', 'leer': 'to read' }
        },
        {
            front: '¿Te gusta ver películas?',
            back: 'Do you like to watch movies?',
            context: 'Asking someone about their interest in movies.',
            grammar: '¿Te gusta...? = Do you like...?',
            breakdown: { '¿Te gusta': 'Do you like', 'ver': 'to watch', 'películas': 'movies' }
        },
        {
            front: 'Mi pasatiempo favorito es tocar la guitarra.',
            back: 'My favorite hobby is playing the guitar.',
            context: 'Specifying your favorite pastime.',
            grammar: 'Tocar is used for playing instruments.',
            breakdown: { 'Mi': 'My', 'pasatiempo': 'hobby', 'favorito': 'favorite', 'es': 'is', 'tocar': 'to play', 'la guitarra': 'the guitar' }
        },
        {
            front: 'Los fines de semana, salgo con mis amigos.',
            back: 'On weekends, I go out with my friends.',
            context: 'Describing your typical weekend activity.',
            grammar: 'Salgo = I go out (salir verb, irregular yo form)',
            breakdown: { 'Los fines de semana': 'On weekends', 'salgo': 'I go out', 'con': 'with', 'mis': 'my', 'amigos': 'friends' }
        },
        {
            front: '¿Practicas algún deporte?',
            back: 'Do you play any sports?',
            context: 'Asking someone if they are involved in sports.',
            grammar: 'Practicar is often used for playing sports.',
            breakdown: { '¿Practicas': 'Do you practice/play', 'algún': 'any', 'deporte?': 'sport?' }
        }
    ]
  },
  pastTensePreterite: {
    name: 'Pasado (Pretérito)',
    emoji: '⏰',
    color: '#60A5FA',
    category: 'Gramática',
    description: 'Talking about the past using the Preterite tense, for completed actions.',
    flashcards: [
      {
        front: 'Ayer comí paella por primera vez.',
        back: 'Yesterday I ate paella for the first time.',
        context: 'Describing a specific, completed action in the past.',
        grammar: 'Comí = I ate (comer verb, preterite)',
        breakdown: { 'Ayer': 'Yesterday', 'comí': 'I ate', 'paella': 'paella', 'por primera vez': 'for the first time' }
      },
      {
        front: 'El año pasado viajamos a España.',
        back: 'Last year we traveled to Spain.',
        context: 'Recounting a past trip.',
        grammar: 'Viajamos = We traveled (viajar verb, preterite)',
        breakdown: { 'El año pasado': 'Last year', 'viajamos': 'we traveled', 'a': 'to', 'España': 'Spain' }
      },
      {
        front: '¿Qué hiciste el fin de semana?',
        back: 'What did you do over the weekend?',
        context: 'A common question to start a conversation on Monday.',
        grammar: 'Hiciste = you did (hacer verb, irregular preterite)',
        breakdown: { '¿Qué': 'What', 'hiciste': 'did you do', 'el fin de semana?': 'the weekend?' }
      },
      {
        front: 'Ella terminó su trabajo a las cinco.',
        back: 'She finished her work at five.',
        context: 'Stating when a task was completed.',
        grammar: 'Terminó = She/he finished (terminar verb, preterite)',
        breakdown: { 'Ella': 'She', 'terminó': 'finished', 'su': 'her', 'trabajo': 'work', 'a las cinco': 'at five' }
      },
      {
        front: 'Anoche vi una película interesante.',
        back: 'Last night I saw an interesting movie.',
        context: 'Talking about an activity from the previous night.',
        grammar: 'Vi = I saw (ver verb, irregular preterite)',
        breakdown: { 'Anoche': 'Last night', 'vi': 'I saw', 'una': 'an', 'película': 'movie', 'interesante': 'interesting' }
      }
    ]
  },
  futureTense: {
    name: 'Futuro',
    emoji: '🔮',
    color: '#F472B6',
    category: 'Gramática',
    description: 'Talking about the future - Phrases for plans, predictions, and upcoming events.',
    flashcards: [
      {
        front: 'Mañana estudiaré para el examen.',
        back: 'Tomorrow I will study for the exam.',
        context: 'Stating a definite plan for tomorrow using the simple future tense.',
        grammar: 'Estudiaré = I will study (future tense of estudiar)',
        breakdown: { 'Mañana': 'Tomorrow', 'estudiaré': 'I will study', 'para': 'for', 'el': 'the', 'examen': 'exam' }
      },
      {
        front: 'El próximo mes, compraremos un coche nuevo.',
        back: 'Next month, we will buy a new car.',
        context: 'Talking about a significant future purchase.',
        grammar: 'Compraremos = We will buy (future tense of comprar)',
        breakdown: { 'El próximo mes': 'Next month', 'compraremos': 'we will buy', 'un': 'a', 'coche': 'car', 'nuevo': 'new' }
      },
      {
        front: '¿Viajarás durante las vacaciones?',
        back: 'Will you travel during the holidays?',
        context: 'Asking about someone\'s vacation plans.',
        grammar: 'Viajarás = You will travel (future tense of viajar, tú form)',
        breakdown: { '¿Viajarás': 'Will you travel', 'durante': 'during', 'las vacaciones': 'the holidays', 'las': 'the', 'vacaciones': 'holidays' }
      },
      {
        front: 'Creo que lloverá más tarde.',
        back: 'I think it will rain later.',
        context: 'Making a prediction about the weather.',
        grammar: 'Lloverá = It will rain (future tense of llover)',
        breakdown: { 'Creo que': 'I think that', 'lloverá': 'it will rain', 'más tarde': 'later' }
      },
      {
        front: '¿Qué harás después de la universidad?',
        back: 'What will you do after university?',
        context: 'Asking about long-term future plans.',
        grammar: 'Harás = you will do (irregular future of hacer)',
        breakdown: { '¿Qué': 'What', 'harás': 'will you do', 'después de': 'after', 'la universidad?': 'the university?' }
      }
    ]
  },
  pastTenseArVerbs: {
    name: 'Pretérito: Verbos -AR',
    emoji: '📚',
    color: '#34D399',
    category: 'Gramática',
    description: 'Learn the past tense (preterite) for regular -AR verbs. This tense is used for completed actions in the past. We will conjugate the verb "hablar" (to speak).',
    flashcards: [
      {
        front: 'Yo hablé con el profesor ayer.',
        back: 'I spoke with the professor yesterday.',
        context: 'This is the "yo" (I) form. The accent on the final "é" is critical. It changes the pronunciation and distinguishes it from other words. Without the accent, "hable" would be a subjunctive form. This ending, "-é", is the rule for all regular -AR verbs in the "yo" form preterite.',
        grammar: "Preterite 'yo' form for -AR verbs. Stem 'habl-' + ending '-é'.",
        breakdown: {
          'Yo': 'I',
          'hablé': 'spoke',
          'con': 'with',
          'el': 'the',
          'profesor': 'professor',
          'ayer': 'yesterday'
        }
      },
      {
        front: 'Tú hablaste con María por teléfono.',
        back: 'You spoke with María on the phone.',
        context: 'This is the "tú" (you, informal) form. The ending "-aste" is consistent for all regular -AR verbs. Unlike the "yo" and "él/ella" forms, this one does not have a written accent mark.',
        grammar: "Preterite 'tú' form for -AR verbs. Stem 'habl-' + ending '-aste'.",
        breakdown: {
          'Tú': 'You (informal)',
          'hablaste': 'spoke',
          'con': 'with',
          'María': 'María',
          'por': 'by / on',
          'teléfono': 'telephone'
        }
      },
      {
        front: 'Usted habló de un tema muy interesante.',
        back: 'You (formal) spoke about a very interesting topic.',
        context: 'This is the "él/ella/usted" (he/she/you formal) form. The verb ending "-ó" is the same for all three pronouns. Again, the accent is crucial. "Habló" (he spoke) is very different from "hablo" (I speak).',
        grammar: "Preterite 'él/ella/usted' form for -AR verbs. Stem 'habl-' + ending '-ó'.",
        breakdown: {
          'Usted': 'You (formal)',
          'habló': 'spoke',
          'de': 'of / about',
          'un': 'a',
          'tema': 'topic',
          'muy': 'very',
          'interesante': 'interesting'
        }
      },
      {
        front: 'Nosotros hablamos sobre la película anoche.',
        back: 'We spoke about the movie last night.',
        context: 'This is the most confusing form for learners. The "nosotros" (we) form of -AR verbs in the preterite is IDENTICAL to the present tense form. Only the context words (like "anoche", "ayer", "la semana pasada") tell you it\'s in the past.',
        grammar: "Preterite 'nosotros' form for -AR verbs. Stem 'habl-' + ending '-amos'. Note: Identical to the present tense form.",
        breakdown: {
          'Nosotros': 'We',
          'hablamos': 'spoke',
          'sobre': 'about',
          'la': 'the',
          'película': 'movie',
          'anoche': 'last night'
        }
      },
      {
        front: 'Vosotros hablasteis con el guía turístico.',
        back: 'You (all) spoke with the tour guide. (Spain, informal)',
        context: 'This is the "vosotros" (you all, informal) form, used primarily in Spain. The "-asteis" ending is the standard for this form with regular -AR verbs. In Latin America, you would use the "ustedes" form instead.',
        grammar: "Preterite 'vosotros' form for -AR verbs. Stem 'habl-' + ending '-asteis'.",
        breakdown: {
          'Vosotros': 'You (plural, informal)',
          'hablasteis': 'spoke',
          'con': 'with',
          'el': 'the',
          'guía': 'guide',
          'turístico': 'tourist'
        }
      },
      {
        front: 'Ellos hablaron durante toda la reunión.',
        back: 'They spoke during the whole meeting.',
        context: 'This is the "ellos/ellas/ustedes" (they/you all) form. The "-aron" ending is the standard for this conjugation. This form is used for "they" (masculine or mixed), "they" (feminine), and "you all" (in Latin America and formal in Spain).',
        grammar: "Preterite 'ellos/ellas/ustedes' form for -AR verbs. Stem 'habl-' + ending '-aron'.",
        breakdown: {
          'Ellos': 'They',
          'hablaron': 'spoke',
          'durante': 'during',
          'toda': 'all / the whole',
          'la': 'the',
          'reunión': 'meeting'
        }
      }
    ]
  },
  pastTenseErVerbs: {
    name: 'Pretérito: Verbos -ER',
    emoji: '🍽️',
    color: '#F9A825',
    category: 'Gramática',
    description: 'Learn the past tense (preterite) for regular -ER verbs. We will conjugate the verb "comer" (to eat) to show the pattern for completed past actions.',
    flashcards: [
      {
        front: 'Yo comí una ensalada para el almuerzo.',
        back: 'I ate a salad for lunch.',
        context: 'This is the "yo" (I) form for -ER verbs. The ending is "-í", with a required accent. This ending applies to all regular -ER verbs in this form.',
        grammar: "Preterite 'yo' form for -ER verbs. Stem 'com-' + ending '-í'.",
        breakdown: {
          'Yo': 'I',
          'comí': 'ate',
          'una': 'a',
          'ensalada': 'salad',
          'para': 'for',
          'el': 'the',
          'almuerzo': 'lunch'
        }
      },
      {
        front: '¿Tú comiste todo el pastel?',
        back: 'Did you eat the whole cake?',
        context: 'This is the "tú" (you, informal) form. The ending is "-iste". This is one of the most consistent and recognizable preterite endings.',
        grammar: "Preterite 'tú' form for -ER verbs. Stem 'com-' + ending '-iste'.",
        breakdown: {
          '¿Tú': 'You (informal)',
          'comiste': 'ate',
          'todo': 'all',
          'el': 'the',
          'pastel?': 'cake?'
        }
      },
      {
        front: 'Él comió en ese restaurante la semana pasada.',
        back: 'He ate at that restaurant last week.',
        context: 'This is the "él/ella/usted" form. The ending "-ió" with the accent is the standard. This helps distinguish it from the present tense.',
        grammar: "Preterite 'él/ella/usted' form for -ER verbs. Stem 'com-' + ending '-ió'.",
        breakdown: {
          'Él': 'He',
          'comió': 'ate',
          'en': 'in / at',
          'ese': 'that',
          'restaurante': 'restaurant',
          'la': 'the',
          'semana': 'week',
          'pasada': 'last'
        }
      },
      {
        front: 'Nosotros comimos paella en Valencia.',
        back: 'We ate paella in Valencia.',
        context: 'This is a key difference from -AR verbs. For regular -ER verbs, the "nosotros" preterite form ("comimos") is DIFFERENT from the present tense form ("comemos"). This makes it less ambiguous.',
        grammar: "Preterite 'nosotros' form for -ER verbs. Stem 'com-' + ending '-imos'. Note: This is different from the present tense 'comemos'.",
        breakdown: {
          'Nosotros': 'We',
          'comimos': 'ate',
          'paella': 'paella',
          'en': 'in',
          'Valencia': 'Valencia'
        }
      },
      {
        front: 'Vosotros comisteis mucho en la fiesta.',
        back: 'You (all) ate a lot at the party. (Spain, informal)',
        context: 'This is the "vosotros" (you all, informal) form, used in Spain. The ending is "-isteis".',
        grammar: "Preterite 'vosotros' form for -ER verbs. Stem 'com-' + ending '-isteis'.",
        breakdown: {
          'Vosotros': 'You (plural, informal)',
          'comisteis': 'ate',
          'mucho': 'a lot',
          'en': 'at',
          'la': 'the',
          'fiesta': 'party'
        }
      },
      {
        front: 'Ustedes comieron antes de venir.',
        back: 'You (all) ate before coming.',
        context: 'This is the "ellos/ellas/ustedes" form. The ending is "-ieron". This form is used for "they" and for the plural "you" in Latin America (and formal "you" in Spain).',
        grammar: "Preterite 'ellos/ellas/ustedes' form for -ER verbs. Stem 'com-' + ending '-ieron'.",
        breakdown: {
          'Ustedes': 'You (plural)',
          'comieron': 'ate',
          'antes': 'before',
          'de': 'of',
          'venir': 'coming / to come'
        }
      }
    ]
  },
  pastTenseIrVerbs: {
    name: 'Pretérito: Verbos -IR',
    emoji: '🏠',
    color: '#60A5FA',
    category: 'Gramática',
    description: 'Learn the past tense (preterite) for regular -IR verbs. We will conjugate "vivir" (to live). Note how similar the endings are to -ER verbs.',
    flashcards: [
      {
        front: 'Yo viví en Argentina por dos años.',
        back: 'I lived in Argentina for two years.',
        context: 'The "yo" form preterite for -IR verbs is "-í", exactly the same as for -ER verbs. This makes learning them together easier.',
        grammar: "Preterite 'yo' form for -IR verbs. Stem 'viv-' + ending '-í'.",
        breakdown: {
          'Yo': 'I',
          'viví': 'lived',
          'en': 'in',
          'Argentina': 'Argentina',
          'por': 'for',
          'dos': 'two',
          'años': 'years'
        }
      },
      {
        front: 'Tú viviste una experiencia increíble.',
        back: 'You lived an incredible experience.',
        context: 'The "tú" form ending is "-iste", which is also identical to the ending for regular -ER verbs in the preterite.',
        grammar: "Preterite 'tú' form for -IR verbs. Stem 'viv-' + ending '-iste'.",
        breakdown: {
          'Tú': 'You (informal)',
          'viviste': 'lived',
          'una': 'an',
          'experiencia': 'experience',
          'increíble': 'incredible'
        }
      },
      {
        front: 'Ella vivió cerca de la playa.',
        back: 'She lived near the beach.',
        context: 'The "él/ella/usted" form ending is "-ió", once again the same as the corresponding -ER verb ending.',
        grammar: "Preterite 'él/ella/usted' form for -IR verbs. Stem 'viv-' + ending '-ió'.",
        breakdown: {
          'Ella': 'She',
          'vivió': 'lived',
          'cerca': 'near',
          'de': 'of',
          'la': 'the',
          'playa': 'beach'
        }
      },
      {
        front: 'Nosotros vivimos allí el año pasado.',
        back: 'We lived there last year.',
        context: 'This is the first major difference from -ER verbs and a critical point. For -IR verbs, the "nosotros" preterite form ("vivimos") is IDENTICAL to the present tense form ("vivimos"), just like with -AR verbs. You need context to know the tense.',
        grammar: "Preterite 'nosotros' form for -IR verbs. Stem 'viv-' + ending '-imos'. Note: Identical to the present tense form.",
        breakdown: {
          'Nosotros': 'We',
          'vivimos': 'lived',
          'allí': 'there',
          'el': 'the',
          'año': 'year',
          'pasado': 'last'
        }
      },
      {
        front: 'Vosotros vivisteis en Madrid, ¿verdad?',
        back: 'You (all) lived in Madrid, right? (Spain, informal)',
        context: 'This is the second difference from -ER verbs. The "vosotros" ending for -IR verbs is "-isteis", just like for -ER verbs. So only the "nosotros" and "vosotros" forms of -er and -ir differ in the present tense, but only the "nosotros" forms differ in the preterite (by being identical to present). This card shows the "-isteis" ending, same as -ER verbs.',
        grammar: "Preterite 'vosotros' form for -IR verbs. Stem 'viv-' + ending '-isteis'.",
        breakdown: {
          'Vosotros': 'You (plural, informal)',
          'vivisteis': 'lived',
          'en': 'in',
          'Madrid': 'Madrid',
          '¿verdad?': 'right? / true?'
        }
      },
      {
        front: 'Ellos escribieron un libro juntos.',
        back: 'They wrote a book together.',
        context: 'Using another -IR verb, "escribir", to show the pattern holds. The "ellos/ellas/ustedes" form ends in "-ieron", which is the same as the ending for -ER verbs.',
        grammar: "Preterite 'ellos/ellas/ustedes' form for -IR verbs. Stem 'escrib-' + ending '-ieron'.",
        breakdown: {
          'Ellos': 'They',
          'escribieron': 'wrote',
          'un': 'a',
          'libro': 'book',
          'juntos': 'together'
        }
      }
    ]
  }
};

// XP Levels Configuration
const XP_LEVELS = {
  1: { xp: 0, title: 'Principiante' },
  2: { xp: 50, title: 'Estudiante' },
  3: { xp: 150, title: 'Aprendiz' },
  4: { xp: 300, title: 'Intermedio' },
  5: { xp: 500, title: 'Avanzado' },
  6: { xp: 750, title: 'Experto' },
  7: { xp: 1050, title: 'Maestro' },
  8: { xp: 1400, title: 'Profesor' },
  9: { xp: 1800, title: 'Gurú' },
  10: { xp: 2250, title: 'Leyenda' }
};

// Default Settings
const DEFAULT_SETTINGS = {
  // TTS Settings
  ttsAutoPlay: true,
  ttsAutoPlayEnglish: false,
  ttsVolume: 0.8,
  ttsRate: 1.0,
  ttsPitch: 1.0,
  ttsCooldown: 3000, // 3 seconds cooldown to prevent repeated messages
  
  // Animation Settings
  animationsEnabled: true,
  flashcardFlipSpeed: 0.8,
  transitionSpeed: 0.3,
  
  // Game Settings
  showProgressBars: true,
  showXP: true,
  showLevelInfo: true,
  
  // UI Settings
  darkMode: 'auto', // 'light', 'dark', 'auto'
  compactMode: false,
  showHints: true,
  
  // Learning Settings
  autoMarkLearned: false,
  showCorrectAnswers: true,
  flexibleAnswerValidation: true,
  
  // Accessibility
  highContrast: false,
  largeText: false,
  reduceMotion: false
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { REGIONS, XP_LEVELS };
}