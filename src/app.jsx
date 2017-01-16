const React = window.React = require('react');
const ReactDOM = require('react-dom');
const mountNode = document.getElementById('app');
import NotFound from './components/NotFound.jsx';
import OfferTables from './components/OfferTables.jsx';
import OfferMakers from './components/OfferMakers.jsx';
import Session from './components/Session.jsx';
import PairPicker from './components/PairPicker.jsx';
import Stellarify from './lib/Stellarify';
import url from 'url';
import Header from './components/Header.jsx';
import Driver from './lib/Driver';

let network = {};

let useLiveNetwork = () => {
  network.horizonUrl = 'https://horizon.stellar.org';
  StellarSdk.Network.usePublicNetwork();
}
let useTestNetwork = () => {
  network.horizonUrl = 'https://horizon-testnet.stellar.org';
  StellarSdk.Network.useTestNetwork();
}
useTestNetwork();

let driver = new Driver({
  horizonUrl: network.horizonUrl,
});


const parseUrl = (href) => {
  let hash = url.parse(href).hash;
  if (hash === null) {
    return '';
  }
  return hash.substr(1);
}

class TermApp extends React.Component {
  constructor(props) {
    super(props);
    this.d = props.d;
    this.state = {
      // The url is the hash cleaned up
      url: parseUrl(window.location.href)
    };
    window.addEventListener('hashchange', (e) => {
      this.setState({
        url: parseUrl(e.newURL)
      })
    } , false);
  }
  render() {
    let url = this.state.url;
    let urlParts = url.split('/');

    let body;
    if (url === '') {
      // Home page
      body = <div className="so-back">
        <div className="so-chunk">
          Welcome to stellarterm.com
        </div>
      </div>
    } else if (urlParts[0] === 'account') {
      body = <Session d={this.d} urlParts={urlParts}></Session>
    } else if (urlParts[0] === 'exchange') {

      if (urlParts.length === 3) {
        // console.log(urlParts);
        let baseBuying = Stellarify.parseAssetSlug(urlParts[1]);
        let counterSelling = Stellarify.parseAssetSlug(urlParts[2]);

        this.d.handlers.setOrderbook(baseBuying, counterSelling);
        // body = <div>blah</div>
        body = <div>
          <div className="so-back islandBack">
            <div className="island island--simplePadTB">
              <PairPicker d={this.d}></PairPicker>
            </div>
          </div>
          <div className="so-back islandBack">
            <div className="island">
              <div className="island__header">
                Orderbook
              </div>
              <OfferMakers d={this.d}></OfferMakers>
              <div className="island__separator"></div>
              <OfferTables d={this.d}></OfferTables>
            </div>
          </div>
        </div>
      } else {
        body = <div>
          Use the markets page to pick a pair
        </div>
      }
    } else {
      body = <NotFound></NotFound>
    }

    return <div>
      <Header></Header>
      {body}
    </div>;

  }
};

ReactDOM.render(<TermApp d={driver} />, mountNode);
