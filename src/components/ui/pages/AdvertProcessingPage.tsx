import React, { useState, FormEvent } from 'react';
import { apiService } from '../../../services/api';
import { AdvertData } from '../../../types/advert';
import { CreateBoxRequest } from '../../../types/api';
import { Button, TextField, Card, IconButton } from '../atoms';
import { TwoActionButtons } from '../molecules';
import CloseIcon from '@mui/icons-material/Close';

const TEST_ADVERT_DATA: AdvertData = {
  jobTitle: "Product Development Manager",
  companyDescriptor: "Alternatives Asset Manager",
  location: "London",
  blurb: "Our client is a UK-based alternatives asset manager with a leading liquid alternatives UCITS platform and a growing private markets offering. The role will drive product strategy and delivery across UCITS, AIF and semi-liquid structures, working closely with investment managers and internal stakeholders.",
  responsibilities: [
      "Research and evaluate new hedge fund and private markets managers and strategies",
      "Conduct competitive analysis and market positioning reviews",
      "Monitor industry trends in alternatives and semi-liquid strategies",
      "Review and optimise fund terms, including pricing, fees and operational features",
      "Implement regulatory and disclosure changes across the product range",
      "Coordinate Consumer Duty reviews and product assessments",
      "Structure and coordinate launches of liquid and semi-liquid funds across UCITS and AIF platforms",
      "Lead end-to-end product development from concept through implementation to go-live",
      "Manage relationships with investment managers (hedge funds and private markets)",
      "Manage external service providers, including legal counsel and other advisers"
  ],
  requirements: [
      "Product development experience within hedge funds or private markets",
      "Deep technical knowledge of UCITS and AIF regulations and structures",
      "Proven track record of fund launches and lifecycle management",
      "Semi-liquid product experience, including liquidity management and redemption mechanisms",
      "Familiarity with UCI Part II funds, ELTIFs or similar structures",
      "Project management capability across the full product lifecycle",
      "CFA preferred; CAIA highly valued",
      "Excellent attention to detail",
      "Strong communication skills"
  ]
};

const useTestData = process.env.NODE_ENV === 'development'; // Or a specific env variable like REACT_APP_USE_TEST_DATA

const AdvertProcessingPage: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [briefingNotes, setBriefingNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [advertData, setAdvertData] = useState<AdvertData | null>(useTestData ? TEST_ADVERT_DATA : null);
  const [pipelineKey] = useState<string>('agxzfm1haWxmb29nYWVyOAsSDE9yZ2FuaXphdGlvbiIRbG9nYW5zaW5jbGFpci5jb20MCxIIV29ya2Zsb3cYgIDF467PogkM');
  const [boxStageKey] = useState<string>('5001');
  const [isPostingBox, setIsPostingBox] = useState<boolean>(false);
  const [postBoxError, setPostBoxError] = useState<string | null>(null);
  const [postBoxSuccess, setPostBoxSuccess] = useState<string | null>(null);

  const handleSubmit = async (e?: FormEvent | React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault();
    }
    if (!pdfFile && !useTestData) {
      setError('Please upload a PDF file.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAdvertData(null);

    const formData = new FormData();
    if (!useTestData) {
      formData.append('pdf', pdfFile as File);
    }
    if (briefingNotes) {
      formData.append('briefingNotes', briefingNotes);
    }

    try {
      if (useTestData) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setAdvertData(TEST_ADVERT_DATA);
      } else {
        const response = await apiService.processAdvert(formData);
        setAdvertData(response);
      }
    } catch (err: any) {
      console.error('API Error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to process advert. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setPdfFile(null);
    setBriefingNotes('');
    setAdvertData(null); // Always clear advertData
    setError(null);
    setPostBoxError(null);
    setPostBoxSuccess(null);
  };

  const handlePostToLSWebsite = async () => {
    if (!advertData) {
      setPostBoxError('Please process an advert first.');
      return;
    }
    if (!pipelineKey) {
      setPostBoxError('Please enter a Pipeline Key.');
      return;
    }
    if (!boxStageKey) {
      setPostBoxError('Please enter a Stage Key for the box.');
      return;
    }

    setIsPostingBox(true);
    setPostBoxError(null);
    setPostBoxSuccess(null);

    const fieldsPayload: Record<string, any> = {
      '1001': advertData.jobTitle + ',' + advertData.companyDescriptor, // ROLE_TITLE
      '1002': advertData.blurb,   // DESCRIPTION
      '1003': advertData.requirements.join('\n'), // REQUIREMENTS (joined by newline)
      '1005': advertData.responsibilities.join('\n'), // RESPONSIBILITIES (joined by newline)
      '1008': "Competitive", // SALARY_RANGE
      '1009': advertData.location, // LOCATION
    };

    const requestBody: CreateBoxRequest = {
      name: advertData.jobTitle,
      notes: advertData.blurb || '', // Ensure notes is always a string, even if empty
      stageKey: boxStageKey,
      fields: fieldsPayload,
    };

    console.log('Request Body:', requestBody); // Log the request body

    try {
      const response = await apiService.createBox(pipelineKey, requestBody);
      setPostBoxSuccess(`Box created successfully! Box ID: ${response.boxId}`);
    } catch (err: any) {
      console.error('Post to LS Website Error:', err);
      setPostBoxError(err.response?.data?.message || err.message || 'Failed to post box to LS Website.');
    } finally {
      setIsPostingBox(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Advert Processing</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Input */}
        <Card className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Input</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="pdf-upload" className="block text-sm font-medium text-gray-700">
                Upload Job Advert PDF <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                id="pdf-upload"
                accept=".pdf"
                required={!useTestData}
                onChange={(e) => setPdfFile(e.target.files ? e.target.files[0] : null)}
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>

            <TextField
              id="briefing-notes"
              label="Optional Role Briefing Notes"
              multiline
              rows={5}
              value={briefingNotes}
              onChange={(e) => setBriefingNotes(e.target.value)}
              placeholder="E.g., Key skills, company culture, specific project details..."
            />

            <TwoActionButtons
              primaryAction={{
                text: isLoading ? 'Processing...' : 'Process Advert',
                onClick: handleSubmit,
                disabled: isLoading || (!pdfFile && !useTestData),
                variant: 'primary',
              }}
              secondaryAction={{
                text: "Clear",
                onClick: handleClear,
                disabled: isLoading,
                variant: 'secondary',
              }}
              loading={isLoading}
            />
          </form>
        </Card>

        {/* Right Column: Output */}
        <Card className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Output</h2>
          {isLoading && <p>Processing advert...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}

          {advertData && (
            <div className="space-y-4">
              <TextField
                id="job-title"
                label="Job Title"
                InputProps={{ readOnly: true }}
                value={advertData.jobTitle}
              />
              <TextField
                id="company-descriptor"
                label="Company Descriptor"
                InputProps={{ readOnly: true }}
                value={advertData.companyDescriptor}
              />
              <TextField
                id="location"
                label="Location"
                InputProps={{ readOnly: true }}
                value={advertData.location}
              />
              <TextField
                id="blurb"
                label="Blurb"
                multiline
                rows={5}
                InputProps={{ readOnly: true }}
                value={advertData.blurb}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Responsibilities:</label>
                <div className="space-y-2">
                  <TextField
                    value={advertData.responsibilities.join('\n\n')}
                    multiline
                    rows={Math.max(5, advertData.responsibilities.length * 2)}
                    InputProps={{ readOnly: true }}
                    className="w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Requirements:</label>
                <div className="space-y-2">
                  <TextField
                      value={advertData.requirements.join('\n\n')}
                      multiline
                      rows={Math.max(5, advertData.requirements.length * 2)}
                      InputProps={{ readOnly: true }}
                      className="w-full"
                    />
                </div>
              </div>
              <hr className="my-4" />
              <h3 className="text-xl font-semibold mb-2">Post to LS Website</h3>
              <div className="space-y-4">
                
                <Button
                  onClick={handlePostToLSWebsite}
                  disabled={isPostingBox || !advertData || !pipelineKey || !boxStageKey}
                  variant="primary"
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isPostingBox ? 'Posting...' : 'Post to LS Website'}
                </Button>
                {postBoxError && <p className="text-red-500 mt-2">Error: {postBoxError}</p>}
                {postBoxSuccess && <p className="text-green-600 mt-2">{postBoxSuccess}</p>}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdvertProcessingPage;
