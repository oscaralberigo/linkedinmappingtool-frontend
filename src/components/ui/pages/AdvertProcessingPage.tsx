import React, { useState } from 'react';
import { apiService } from '../../../services/api';
import { AdvertData } from '../../../types/advert';
import { CreateBoxRequest } from '../../../types/api';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Info as InfoIcon } from '@mui/icons-material';



const AdvertProcessingPage: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [briefingNotes, setBriefingNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [advertData, setAdvertData] = useState<AdvertData | null>(null);
  const [pipelineKey] = useState<string>('agxzfm1haWxmb29nYWVyOAsSDE9yZ2FuaXphdGlvbiIRbG9nYW5zaW5jbGFpci5jb20MCxIIV29ya2Zsb3cYgIC5rqyUlwkM');
  const [boxStageKey] = useState<string>('5001');
  const [isPostingBox, setIsPostingBox] = useState<boolean>(false);
  const [postBoxError, setPostBoxError] = useState<string | null>(null);
  const [postBoxSuccess, setPostBoxSuccess] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!pdfFile) {
      setError('Please upload a PDF file.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAdvertData(null);
    const formData = new FormData();
    formData.append('pdf', pdfFile as File);
    if (briefingNotes) formData.append('briefingNotes', briefingNotes);
    try {
      setAdvertData(await apiService.processAdvert(formData));
    } catch (err: any) {
      console.error('API Error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to process advert. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostToLSWebsite = async () => {
    if (!advertData) return setPostBoxError('Please process an advert first.');
    if (!pipelineKey) return setPostBoxError('Please enter a Pipeline Key.');
    if (!boxStageKey) return setPostBoxError('Please enter a Stage Key for the box.');
    setIsPostingBox(true);
    setPostBoxError(null);
    setPostBoxSuccess(null);

    // Helper function to filter out empty lines
    const filterEmptyLines = (items: string[]) => {
      return items.filter(item => item.trim().length > 0);
    };

    const formatListAsHtml = (items: string[], title: string) => {
      const filteredItems = filterEmptyLines(items);
      return `<p>${title}:</p><ul>${filteredItems.map(item => `<li>${item.trim()}</li>`).join('')}</ul>`;
    };

    const fieldsPayload: Record<string, any> = {
      '1001': advertData.jobTitle + ',' + advertData.companyDescriptor,
      '1002': advertData.blurb,
      '1003': formatListAsHtml(advertData.requirements, 'Requirements'),
      '1005': formatListAsHtml(advertData.responsibilities, 'Responsibilities'),
      '1008': "Competitive",
      '1009': advertData.location,
    };
    const requestBody: CreateBoxRequest = {
      name: advertData.jobTitle,
      notes: advertData.blurb || '',
      stageKey: boxStageKey,
      fields: fieldsPayload,
    };
    console.log('Request Body:', requestBody);
    try {
      const response = await apiService.createBox(pipelineKey, requestBody);
      setPostBoxSuccess(`Box created successfully!`);
    } catch (err: any) {
      console.error('Post to LS Website Error:', err);
      setPostBoxError(err.response?.data?.message || err.message || 'Failed to post box to LS Website.');
    } finally {
      setIsPostingBox(false);
    }
  };

  const commonLabelStyle = { display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#333', marginBottom: '0.25rem' } as const;
  const commonInputStyle = { width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: 'white' } as const;
  const commonTextareaStyle = { ...commonInputStyle, resize: 'vertical' } as const;
  const errorStyle = { marginTop: '1rem', padding: '0.75rem', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', fontSize: '0.9rem' } as const;
  const successStyle = { marginTop: '1rem', padding: '0.75rem', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', fontSize: '0.9rem' } as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', minHeight: '100vh', fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }}>
      <div style={{ width: '100%', padding: '0rem', backgroundColor: '#f8f9fa', borderBottom: '1px solid #e0e0e0', boxSizing: 'border-box'  }}>
        {/* Logo */}
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'grey.200' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <img
              src="/ls-logo-black.png"
              alt="Logan Sinclair"
              style={{
                maxWidth: '200px',
                height: 'auto',
                display: 'block',
                cursor: 'pointer',
                transition: 'opacity 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            />
          </Link>
        </Box>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', margin: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '1rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '1rem', fontWeight: 500, color: '#333', marginBottom: '0.5rem' }}>Upload Job Advert PDF</label>
            <input type="file" accept=".pdf" required onChange={(e) => setPdfFile(e.target.files ? e.target.files[0] : null)} style={{ width: '100%', padding: '0.5rem', border: '2px dashed #ccc', borderRadius: '4px', fontSize: '0.9rem', color: '#666' }} />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '1rem', fontWeight: 500, color: '#333', marginBottom: '0.5rem' }}>Optional Role Briefing Notes</label>
            <textarea value={briefingNotes} onChange={(e) => setBriefingNotes(e.target.value)} placeholder="Paste in your briefing notes here..." rows={5} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.9rem', resize: 'vertical' }} />
          </div>
          <button onClick={handleSubmit} disabled={isLoading || !pdfFile} style={{ width: '100%', padding: '0.75rem 1.5rem', backgroundColor: isLoading || !pdfFile ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1rem', fontWeight: 500, cursor: isLoading || !pdfFile ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s' }} onMouseOver={(e) => { if (!isLoading && pdfFile) e.currentTarget.style.backgroundColor = '#0056b3'; }} onMouseOut={(e) => { if (!isLoading && pdfFile) e.currentTarget.style.backgroundColor = '#007bff'; }}>
            {isLoading ? 'Processing...' : 'Generate Advert'}
          </button>
          {error && <div style={errorStyle}>Error: {error}</div>}
        </div>
      </div>
      <div style={{ width: '100%', padding: '2rem', backgroundColor: 'white', display: 'flex', flexDirection: 'column', height: '100vh', boxSizing: 'border-box' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '2rem', color: '#333' }}>AI Generated Advert</h2>
        {isLoading && <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>Processing advert... This make take up to 1 minute, go grab a coffee.</div>}
        {!advertData && !isLoading && <div style={{ textAlign: 'center', padding: '3rem', color: '#999', fontStyle: 'italic' }}>Upload a file and click "Generate Advert" to see results here</div>}
        {advertData && (
          <>
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem' }}>
              <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={commonLabelStyle}>Job Title</label>
                  <input 
                    type="text" 
                    value={advertData.jobTitle} 
                    onChange={(e) => setAdvertData({...advertData, jobTitle: e.target.value})}
                    style={commonInputStyle} 
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={commonLabelStyle}>Company Descriptor</label>
                  <input 
                    type="text" 
                    value={advertData.companyDescriptor} 
                    onChange={(e) => setAdvertData({...advertData, companyDescriptor: e.target.value})}
                    style={commonInputStyle} 
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={commonLabelStyle}>Location</label>
                  <input 
                    type="text" 
                    value={advertData.location} 
                    onChange={(e) => setAdvertData({...advertData, location: e.target.value})}
                    style={commonInputStyle} 
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={commonLabelStyle}>Blurb</label>
                  <textarea 
                    value={advertData.blurb} 
                    onChange={(e) => setAdvertData({...advertData, blurb: e.target.value})}
                    rows={5} 
                    style={{ ...commonTextareaStyle, minHeight: '100px' } as const} 
                  />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={commonLabelStyle}>Responsibilities</label>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <InfoIcon sx={{ fontSize: 16, color: '#666' }} />
                    <Typography variant="caption" sx={{ color: '#666', fontSize: '0.8rem' }}>
                      Add responsibilities as a list, with each responsibility on a new line.
                    </Typography>
                  </Box>
                  <textarea
                    value={advertData.responsibilities.join('\n')}
                    onChange={(e) => {
                      // Allow normal editing by updating with raw input temporarily
                      const rawLines = e.target.value.split(/\r?\n/);
                      setAdvertData({...advertData, responsibilities: rawLines});
                    }}
                    onBlur={(e) => {
                      // Process and clean up when user finishes editing
                      const lines = e.target.value.split(/\r?\n/);
                      const items = lines
                        .map(line => line.trim())
                        .filter(line => line.length > 0);
                      setAdvertData({...advertData, responsibilities: items});
                    }}
                    rows={Math.max(5, advertData.responsibilities.length * 2)}
                    style={commonTextareaStyle}
                  />
                  
                </div>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={commonLabelStyle}>Requirements</label>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <InfoIcon sx={{ fontSize: 16, color: '#666' }} />
                    <Typography variant="caption" sx={{ color: '#666', fontSize: '0.8rem' }}>
                      Add requirements as a list, with each requirement on a new line.
                    </Typography>
                  </Box>
                  <textarea
                    value={advertData.requirements.join('\n')}
                    onChange={(e) => {
                      // Allow normal editing by updating with raw input temporarily
                      const rawLines = e.target.value.split(/\r?\n/);
                      setAdvertData({...advertData, requirements: rawLines});
                    }}
                    onBlur={(e) => {
                      // Process and clean up when user finishes editing
                      const lines = e.target.value.split(/\r?\n/);
                      const items = lines
                        .map(line => line.trim())
                        .filter(line => line.length > 0);
                      setAdvertData({...advertData, requirements: items});
                    }}
                    rows={Math.max(5, advertData.requirements.length * 2)}
                    style={commonTextareaStyle}
                  />
                  
                </div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid #ccc', paddingTop: '1.5rem', backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '1rem', color: '#333' }}>Post to LS Website</h3>
              <button onClick={handlePostToLSWebsite} disabled={isPostingBox || !advertData || !pipelineKey || !boxStageKey} style={{ width: '100%', padding: '0.75rem 1.5rem', backgroundColor: isPostingBox || !advertData || !pipelineKey || !boxStageKey ? '#ccc' : '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1rem', fontWeight: 500, cursor: isPostingBox || !advertData || !pipelineKey || !boxStageKey ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s' }} onMouseOver={(e) => { if (!isPostingBox && advertData && pipelineKey && boxStageKey) e.currentTarget.style.backgroundColor = '#218838'; }} onMouseOut={(e) => { if (!isPostingBox && advertData && pipelineKey && boxStageKey) e.currentTarget.style.backgroundColor = '#28a745'; }}>
                {isPostingBox ? 'Posting...' : 'Post to LS Website'}
              </button>
              {postBoxError && <div style={errorStyle}>Error: {postBoxError}</div>}
              {postBoxSuccess && <div style={successStyle}>{postBoxSuccess}</div>}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdvertProcessingPage;