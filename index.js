import { create } from 'rung-sdk';
import { promisify } from 'bluebird';
import { path, head, split, contains } from 'ramda';
import { String as Text } from 'rung-cli/dist/types';
import superagent from 'superagent';
import { parseString } from 'xml2js-parser';
import { OneOf } from 'rung-sdk/dist/types';

const parseXML = promisify(parseString);

function render(code, city, situation) {
    const result = contains(situation, [
        'Parcialmente Nublado',
        'Predomínio de Sol',
        'Encoberto',
        'Nublado',
        'Céu Claro',
        'Variação de Nebulosidade'
    ]);

    if (result) { 
        return { alerts: [] };
    }
    else {
        return {
            title: `O tempo em ${code} - ${city} está ${situation}.`
        };
    }
}

function getSituation(airport) {
    return superagent.get(`http://servicos.cptec.inpe.br/XML/estacao/${airport}/condicoesAtuais.xml`)
        .then(({ text }) => parseXML(text))
        .then(path(['metar', 'tempo_desc']))
        .then(head);
}

function main(context, done) {
    const { airportInfo } = context.params;
    
    const [code, city] = split(' - ', airportInfo);

    getSituation(code)
        .then(situation => {
            console.log(situation)
            done({ alerts: [render(code, city, situation)] });
        })
        .catch(done);
}

const local = [
    'SBTK - Tarauacá/AC',
    'SBRB - Presidente Médici/AC',
    'SBCZ - Internacional/AC',
    'SBMO - Zumbi dos Palmares/AL',
    'SBEG - Eduardo Gomes/AM',
    'SBMN - Ponta Pelada/AM',
    'SBMY - Manicoré/AM',
    'SBTT - Tabatinga/AM',
    'SBYA - Iuaretê/AM',
    'SBUA - São Gabriel da Cachoeira/AM',
    'SBTF - Tefé/AM', 'SBAM - Amapá/AP',
    'SBMQ - Internacional/AP',
    'SBOI - Oiapoque/AP',
    'SBLP - Bom Jesus da Lapa/BA',
    'SBCV - Caravelas/BA',
    'SBIL - Jorge Amado/BA',
    'SBLE - Chapada Diamantina/BA',
    'SBUF - Paulo Afonso/BA',
    'SBPS - Porto Seguro/BA',
    'SBSV - Dep. Luís Eduardo Magalhães/BA',
    'SBQV - Vitória da Conquista/BA',
    'SBFZ - Pinto Martins/CE',
    'SBJU - Cariri/CE',
    'SBBR - Juscelino Kubitschek/DF',
    'SBVT - Eurico Aguiar Salles/ES',
    'SBAN - Anápolis/GO',
    'SBGO - Santa Genoveva/GO',
    'SBCI - Carolina/MA',
    'SBIZ - Imperatriz/MA',
    'SBSL - Mar. Cunha Machado/MA',
    'SBAX - Araxá/MG',
    'SBPR - Carlos Prates/MG',
    'SBBQ - Barbacena/MG',
    'SBBH - Pampulha/MG',
    'SBCF - Tancredo Neves/MG',
    'SBPC - Poços de Caldas/MG',
    'SBUR - Uberaba/MG',
    'SBUL - Uberlândia/MG',
    'SBIP - Ipatinga/MG',
    'SBJF - Francisco de Assis/MG',
    'SBMK - Montes Claros/MG',
    'SBVG - Varginha/MG',
    'SBGV - Gov. Valadares/MG',
    'SBCG - Internacional/MS',
    'SBCR - Corumbá/MS',
    'SBPP - Internacional/MS',
    'SBAT - Alta Floresta/MT',
    'SBBW - Barra do Garças/MT',
    'SBCY - Marechal Rondon/MT',
    'SBHT - Altamira/PA',
    'SBBE - Val - de - Cans/PA',
    'SBIH - Itaituba/PA',
    'SBEK - Jacareacanga/PA',
    'SBMA - Marabá/PA',
    'SBCC - Cachimbó/PA',
    'SBTB - Trombetas/PA',
    'SBCJ - Carajás/PA',
    'SBSN - Santarém/PA',
    'SBTU - Tucuruí/PA',
    'SBAA - Conceição do Araguaia/PA',
    'SBKG - Pres. João Suassuna/PB',
    'SBJP - Pres. Castro Pinto/PB',
    'SBFN - Fernando de Noronha/PE',
    'SBRF - Guararapes/PE',
    'SBPL - Sen. Nilo Coelho/PE',
    'SBPB - Dr. João Silva Filho/PI',
    'SBTE - Sen. Petrônio Portella/PI',
    'SBLO - Londrina/PR',
    'SBFI - Cataratas/PR',
    'SBBI - Bacacheri/PR',
    'SBCT - Afonso Pena/PR',
    'SBMG - Silvio Name Junior/PR',
    'SBCB - Cabo Frio/RJ',
    'SBAF - Afonsos/RJ',
    'SBGL - Galeão/RJ',
    'SBJR - Jacarepaguá/RJ',
    'SBRJ - Santos Dumont/RJ',
    'SBSC - Santa Cruz/RJ',
    'SBME - Macaé/RJ',
    'SBES - S. Pedro da Aldeia/RJ',
    'SBCP - Bartolomeu Lysandro/RJ',
    'SBMS - Dix - Sept Rosado/RN',
    'SBNT - Augusto Severo/RN',
    'SBGM - Guajará Mirim/RO',
    'SBVH - Brigadeiro Camarão/RO',
    'SBPV - Gov. Jorge Teixeira de Oliveira/RO',
    'SBBV - Boa Vista/RR',
    'SBBG - Bagé/RS',
    'SBSM - Santa Maria/RS',
    'SBPA - Salgado Filho/RS',
    'SBPK - Pelotas/RS',
    'SBCO - Canoas/RS',
    'SBUG - Rubem Berta/RS',
    'SBCH - Chapecó/SC',
    'SBCM - Forquilinha/SC',
    'SBFL - Hercílio Luz/SC',
    'SBJV - Lauro Carneiro de Loyola/SC',
    'SBNF - Min. Victor Konder/SC',
    'SBAR - Santa Maria/SE',
    'SBAU - Araçatuba/SP',
    'SBBU - Bauru/SP',
    'SBKP - Viracopos/SP',
    'SBDN - Pres. Prudente/SP',
    'SBRP - Leite Lopes/SP',
    'SBSR - S. J. do Rio Preto/SP',
    'SBYS - Fontenelle/SP',
    'SBST - Base Aérea/SP',
    'SBGP - Gavião Peixoto/SP',
    'SBGW - Guaratinguetá/SP',
    'SBGR - Guarulhos/SP',
    'SBSJ - São J. dos Campos/SP',
    'SBMT - Campo de Marte/SP',
    'SBSP - Congonhas/SP',
    'SBTA - Taubaté/SP',
    'SBPJ - Palmas/TO',
    'SBPN - Porto Nacional/TO'
];

const params = {
    airportInfo: {
        description: _('Código do aeroporto (ICAO):'),
        type: OneOf(local),
        default: 'SBJV - Joinville'
    }
};

export default create(main, {
    params,
    primaryKey: true,
    title: _("Situação dos Aeroportos"),
    description: _("Veja a situação dos aeroportos brasileiros"),
    preview: render('SBJV', 'Joinville', 'Chuvoso')
});

