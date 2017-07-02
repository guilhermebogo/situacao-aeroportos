import { create } from 'rung-sdk';
import { promisify } from 'bluebird';
import { path, head, split, contains } from 'ramda';
import { String as Text } from 'rung-cli/dist/types';
import superagent from 'superagent';
import { parseString } from 'xml2js-parser';
import { OneOf } from 'rung-sdk/dist/types';

const parseXML = promisify(parseString);

var map = {
    ec: 'Encoberto com chuvas isoladas',
    ci: 'Chuvas isoladas',
    c: 'Chuva',
    in: 'Instável',
    pp: 'Possibilidade de pancadas de chuva',
    cm: 'Chuva pela manhã',
    cn: 'Chuva a noite',
    pt: 'Pancadas de chuva a tarde',
    pm: 'Pancadas de chuva pela manhã',
    np: 'Nublado com pancadas de chuva',
    pc: 'Pancadas de chuva',
    pn: 'Parcialmente nublado',
    cv: 'Chuvisco',
    ch: 'Chuvoso',
    t: 'Tempestade',
    ps: 'Predomínio de sol',
    e: 'Encoberto',
    n: 'Nublado',
    cl: 'Céu claro',
    nv: 'Nevoeiro',
    g: 'Geada',
    ne: 'Neve',
    pnt: 'Pancadas de chuva a noite',
    psc: 'Possibilidade de chuva',
    pcm: 'Possibilidade de chuva pela manhã',
    pct: 'Possibilidade de chuva a tarde',
    pcn: 'Possibilidade de chuva a noite',
    npt: 'Nublado com pancadas a tarde',
    npn: 'Nublado com pancadas a noite',
    ncn: 'Nublado com possibilidade de chuva a noite',
    nct: 'Nublado com possibilidade de chuva a tarde',
    ncm: 'Nublado com possibilidade de chuva pela manhã',
    npm: 'Nublado com pancadas pela manhã',
    npp: 'Nublado com possibilidade de chuva',
    vn: 'Variação de nebulosidade',
    ct: 'Chuva a tarde',
    ppn: 'Possibilidade de pancadas de chuva a noite',
    ppt: 'Possibilidade de pancadas de chuva a tarde',
    ppm: 'Possibilidade de pancadas de chuva pela manhã'
};

const styles = {
    backgroundImage: 'url(http://i.imgur.com/oLkeZE2.png)',
    position: 'absolute',
    top: '-10px',
    color: '#50666B'
};

function deveGerarAlerta(situation) {
    return !contains(situation, ['pn', 'ps', 'e', 'n', 'cl']);
}

function renderComment() {
    return `
        Verifique a situação do seu vôo com a companhia aérea.

        **Telefones úteis:**

        Abaeté Linhas Aéreas: (71) 3377-3955
        ASTA: América do Sul Transporte Aéreo - (65) 3614-2648
        Azul: 0800 884 4040
        Cruiser: 0300-789-2112
        GOL: 0800 704 0465
        Meta Linhas Aéreas: (91) 3210-6383
        NHT: 0300 143 4343
        Noar Linhas Aéreas: 0800 601 2999
        Pantanal Linhas Aéreas: 0800 602 5888
        Passaredo Linhas Aéreas: 0800 770 3757
        Puma Air: (91) 3003-7862
        Rico Linhas Aéreas: (92) 4009-8300
        SETE Linhas Aéreas: (62) 3096-7007
        SOL Linhas Aéreas: 0800 727 4353
        TAM: 0800 570 5700
        TEAM Linhas Aéreas: (21) 3814-7510
        TRIP Linhas Aéreas: 0800 722 8747
        Webjet: 0800 723 1234
        Aerolineas Argentinas: 0800 707 3313
        Aeroméxico: 0800 771 6535
        Aerosur: (11) 3214-0484 e (11) 2445-3136
        Air Canadá: 0800 770 9250
        Air Caraibes: (91) 3210-6334
        Air China: (11) 3186-8888
        Air Europa: (71) 3347-8899
        Air France: 0800 888 7000
        Alitalia: (11) 2445-2005 e (11) 2171-7610
        American Airlines: 0300 789 7778
        ANA - All Nippon Airways: (11) 2141-2121
        Avianca: 0800-286-6543
        British Airways: 0800 892 0011
        Continental Airlines: 0800 891 2889
        Copa Airlines: (11) 3549-2672
        Cubana de Aviación: (11) 3258-7828
        Delta Airlines: (11) 2172-7700 e (21) 4003-2121
        EL AL - Israel Airlines: (11) 3075-5500
        Emirates: 0800 770 2130
        Iberia: (11) 3218-7130
        JAL - Japan Airlines: 0800 771 2100
        KLM - Royal Dutch Airlines: 0800 891 5024
        Korean Air: 0800 6060 777
        LAN: 0300 788 0045
        Lufthansa: (11) 3048-5800
        Pluna: 0800 8923 080
        Qantas: 0800 772 6827
        Qatar Airways: (11) 2575-3000
        SAA - South African Airways: 0800 7711 030
        Singapore Airlines: (11) 3179-0886
        Surinam Airways: (91) 3210-6435 e (91) 3210-6436
        Swiss International Air Lines: (11) 3049-2720
        Taag Linhas Aéreas: 0800 282 2206
        TACA: 0800 761 8222
        TACV - Transportes Aéreos de Cabo Verde: (85) 3392-1354
        TAF: 0300-313-2000
        TAP: 0800 727 23 47
        Turkish Airlines: (11) 3371-9600
        United Airlines: 0800 16 2323
        US Airways: 0800 761 1114
        Addey Táxi Aéreo: (71) 3204-1393
        Aero Star: (71) 3377-4406
        Aeróleo Táxi Aéreo: (21) 2210-2434
        Aerotáxi Abaeté: (71) 3462-9666
        Amazonaves Táxi Aéreo: (92) 3654-5555
        Blue Air Táxi Aéreo: (79) 3223-4001
        Brabo Táxi Aéreo: (91) 3233-4884
        JetSet Brasil Táxi Aéreo: (21) 2462-0361
        Líder Aviação: (31) 3490-4500
        Manaus Aerotáxi: (92) 3652-1620
        Nordeste Táxi Aéreo: (85) 3476-2309
        TAF - Táxi Aéreo Fortaleza: (85) 3277-8000
        Top Line Táxi Aéreo: (86) 3225-9900

        *Fonte: UOL Viagens*
    `;
}

function render(city, situation) {
    return (
        <div styles={ styles }>
            <h2>A previsão para <b>{ city }</b> é <b>{ map[situation] }</b></h2>
        </div>
    );
}

function getSituation(airport) {
    return superagent.get(`http://servicos.cptec.inpe.br/XML/estacao/${airport}/condicoesAtuais.xml`)
        .then(({ text }) => parseXML(text))
        .then(path(['metar', 'tempo']))
        .then(head);
}

function main(context, done) {
    const { airportInfo } = context.params;
    const [code, city] = split(' - ', airportInfo);

    getSituation(code)
        .then(situation => {
            if (deveGerarAlerta(situation)) {
                done({
                    alerts: [{
                        title: 'Previsão para estação de superfície',
                        content: render(city, situation),
                        comment: renderComment()
                    }]
                });
            } else {
                done({ alerts: [] });
            }
        })
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
        description: _('Código do aeroporto (ICAO)'),
        type: OneOf(local),
        default: 'SBJV - Joinville/SC'
    }
};

export default create(main, {
    params,
    primaryKey: true,
    title: _("Situação dos Aeroportos"),
    description: _("Veja a situação dos aeroportos brasileiros. Fonte: CPTEC/INPE."),
    preview: render('Joinville', 'ch')
});
