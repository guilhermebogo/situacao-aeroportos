import { create } from 'rung-sdk';
import { String as Text } from 'rung-cli/dist/types';

function render(name) {
    return <b>{ _('Hello {{name}}', { name }) }</b>;
}

function main(context) {
    const { name } = context.params;
    return {
        alerts: [{
            title: _('Welcome'),
            content: render(name)
        }]
    };
}

const params = {
    name: {
        description: _('What is your name?'),
        type: Text
    }
};

export default create(main, {
    params,
    primaryKey: true,
    title: _("Situação dos Aeroportos"),
    description: _("Veja a situação dos aeroportos brasileiros"),
    preview: render('Trixie')
});
    
