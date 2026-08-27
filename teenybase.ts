import {DatabaseSettings, TableAuthExtensionData, TableRulesExtensionData} from 'teenybase'
import {baseFields, authFields, createdTrigger, updatedTrigger} from 'teenybase/scaffolds/fields'

export default {
    appUrl: 'http://localhost:8787',
    jwtSecret: '$JWT_SECRET',
    tables: [{
        name: 'users',
        autoSetUid: true,
        fields: [...baseFields, ...authFields],
        triggers: [createdTrigger, updatedTrigger],
        extensions: [
            {
                name: 'auth',
                passwordType: 'sha256',
                jwtSecret: '$JWT_SECRET_USERS',
                jwtTokenDuration: 3600,
                maxTokenRefresh: 5,
                passwordConfirmSuffix: 'Confirm',
            } as TableAuthExtensionData,
            {
                name: 'rules',
                listRule: 'auth.uid == id',
                viewRule: 'auth.uid == id',
                createRule: 'true',
                updateRule: 'auth.uid == id',
                deleteRule: 'auth.uid == id',
            } as TableRulesExtensionData,
        ],
    }],
} satisfies DatabaseSettings
