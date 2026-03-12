"use client";

import React from 'react';
import { Search, MapPin, Grid, Layers } from 'lucide-react';

export default function FilterBar() {
  return (
    <div className="filter-bar-wrapper">
      <div className="container">
        <form className="filter-grid" onSubmit={e => e.preventDefault()}>
          
          <div className="filter-input-group">
            <div className="filter-icon">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Kurs, Eğitmen ara..." 
              className="filter-input"
            />
          </div>
          
          <div className="filter-input-group">
            <div className="filter-icon">
              <Grid size={20} />
            </div>
            <select className="filter-select" defaultValue="">
              <option value="" disabled>Kategori Seçin</option>
              <option value="celik">Çelik Yapı Tasarımı</option>
              <option value="betonarme">Betonarme Yapı Tasarımı</option>
              <option value="ahsap">Yapısal Ahşap Tasarımı</option>
              <option value="bim">BIM (Bina Bilgi Modelleme)</option>
            </select>
          </div>

          <div className="filter-input-group desktop-only">
            <div className="filter-icon">
              <Layers size={20} />
            </div>
            <select className="filter-select" defaultValue="">
              <option value="" disabled>Alan Seçin</option>
              <option value="temel">Temel</option>
              <option value="deprem">Depreme Dayanıklı</option>
              <option value="performans">Performansa Dayalı</option>
              <option value="analiz">Değerlendirme ve Analiz</option>
            </select>
          </div>
          
          <button type="submit" className="search-btn">
            ARA
          </button>
          
        </form>
      </div>
    </div>
  );
}
