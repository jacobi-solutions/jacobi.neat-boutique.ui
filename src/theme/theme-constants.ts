export const THEME = {
    avatar: {
        defaultImage: 'https://storage.googleapis.com/neatboutique.com/images/avatar.svg',
    },

    colors: {
        list: ['#ffbc00','#dc7731','#93290f','#916dd5','#65c2db','#409195','#9eaebe','#0e5176','#013e43'],
        primary: {
            green: '#409195',
            purple: '#916dd5',
            yellow: '#ffbc00',
            orange: '#dc7731',
            red: '#93290f',
            blue: '#65c2db',
            darkGreen: '#013e43',
            grey: '#9eaebe',
            darkBlue: '#0e5176',
        },
        variant: {
            lightGey: '#b2b2b2',
            darkGrey: '#7c7c7c',
        },
    },

    
    fonts: {
        paragraph: {
            family: 'HelveticaNeue',
            size: '1.1rem',
        },
        input: {
            family: 'HelveticaNeue',
            size: '1.5rem',
        }
    },

    // if changes are made here, must update corresponding SCSS vars in `src/theme/variables.scss`
    modals: {
        cssBase: 'custom-modal',
        requireLogin: {
            cssClass: 'require-login-warning-modal',
        },
        confirmActionWarning: {
            cssClass: 'confirm-action-warning-modal',
        },
        chooseAccountType: {
            cssClass: 'choose-account-type-modal',
        },
        chooseAnswerRanking: {
            cssClass: 'choose-answer-ranking-modal',
        },
    },
};