import { LightningElement, wire } from 'lwc';
import getBoatTypes from '@salesforce/apex/BoatDataService.getBoatTypes';

export default class BoatSearchForm extends LightningElement {
    
    selectedBoatTypeId = '';
    boatLength;
    // Private
    error = undefined;
    
    searchOptions;
    
    // Wire a custom Apex method
    @wire(getBoatTypes)
    boatTypes({ data, error }) {
        if (data) {
            this.searchOptions = data.map(type => {
                return { label: type.Name, value: type.Id };
            });
            this.searchOptions.unshift({ label: 'All Types', value: '' });
        } else if (error) {
            this.searchOptions = undefined;
            this.error = error;
        }
    }
    
    handleLengthChange(event) {
        this.boatLength = event.detail.value;
        this.fireSearchEvent();
    }

    // Fires event that the search option has changed.
    // passes boatTypeId (value of this.selectedBoatTypeId) in the detail
    handleSearchOptionChange(event) {
        this.selectedBoatTypeId = event.detail.value;
        this.fireSearchEvent();
    }

    fireSearchEvent() {
        console.log('BoatId: ' + this.selectedBoatTypeId + ' BoatLength: ' + this.boatLength);
        // Fire the custom event)
        const searchEvent = new CustomEvent('search', {
            detail: {
                boatTypeId: this.selectedBoatTypeId,
                boatLength: this.boatLength
            }
        });
        this.dispatchEvent(searchEvent);
    }
}