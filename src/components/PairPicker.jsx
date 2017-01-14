const React = window.React = require('react');
import AssetCard from './AssetCard.jsx';

export default class PairPicker extends React.Component {
  constructor(props) {
    super(props);
    this.props.d.listenOrderbook(() => {
      this.forceUpdate();
    });
  }
  render() {
    let baseBuying = this.props.d._baseBuying;
    let counterSelling = this.props.d._counterSelling;


    return (
      <div className="OfferTables island__sub">
        <div className="OfferTables__tables island__sub__division">
          <h3 className="island__sub__division__title">Base asset</h3>
          <AssetCard asset={baseBuying}></AssetCard>
        </div>
        <div className="OfferTables__table island__sub__division">
          <h3 className="island__sub__division__title">Counter asset</h3>
          <AssetCard asset={counterSelling}></AssetCard>
        </div>
      </div>
    );
  }
};
