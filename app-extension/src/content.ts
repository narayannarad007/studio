import type { ExtractedJobData, ExtensionMessage } from './shared/types';

let detectedJobData: ExtractedJobData | null = null;

/**
 * Tries to extract job data from a JSON-LD script tag.
 * This is the most reliable method for sites that support it (like Google Jobs, LinkedIn, etc.).
 */
function extractJobDataFromJSONLD(): ExtractedJobData | null {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  for (const script of scripts) {
    try {
      const json = JSON.parse(script.textContent || '{}');
      // The JobPosting schema can be nested inside a graph.
      const graph = json['@graph'];
      let jobPosting = null;

      if (Array.isArray(graph)) {
        jobPosting = graph.find(item => item['@type'] === 'JobPosting');
      } else if (json['@type'] === 'JobPosting') {
        jobPosting = json;
      }

      if (jobPosting) {
        console.log('CareerPilot: Found JobPosting schema', jobPosting);
        return {
          title: jobPosting.title,
          company: jobPosting.hiringOrganization?.name,
          location: jobPosting.jobLocation?.address?.addressLocality,
          description: jobPosting.description,
          sourceUrl: window.location.href,
        };
      }
    } catch (e) {
      // Silently fail if JSON is invalid.
    }
  }
  return null;
}

/**
 * A fallback function to extract job data from common HTML elements.
 * This is less reliable and more of a best-effort approach.
 */
function extractJobDataFromDOM(): ExtractedJobData | null {
    // This is a very basic example. A real-world implementation would need
    // more sophisticated selectors and logic, possibly with site-specific adapters.
    const titleSelectors = ['h1', '.job-title', '[class*="job-title"]'];
    const companySelectors = ['[class*="company"]', '[id*="company"]', '.job-company'];
    const descriptionSelectors = ['[class*="description"]', '[id*="description"]', '.job-description'];

    const title = titleSelectors.map(s => document.querySelector(s)?.textContent).find(Boolean);
    const company = companySelectors.map(s => document.querySelector(s)?.textContent).find(Boolean);
    const description = descriptionSelectors.map(s => document.querySelector(s)?.innerHTML).find(Boolean);
    
    if (title && description) {
        return {
            title: title.trim(),
            company: company?.trim(),
            description,
            sourceUrl: window.location.href,
        };
    }
    return null;
}


function detectAndStoreJobData() {
  // Prioritize the reliable JSON-LD method.
  let jobData = extractJobDataFromJSONLD();

  // If that fails, try the less reliable DOM scraping method.
  if (!jobData) {
    jobData = extractJobDataFromDOM();
  }

  if (jobData) {
    console.log('CareerPilot: Detected job data on page:', jobData);
    detectedJobData = jobData;
  } else {
    detectedJobData = null;
  }
}

// Listen for messages from other parts of the extension (e.g., the popup).
chrome.runtime.onMessage.addListener((message: ExtensionMessage, sender, sendResponse) => {
  if (message.type === 'GET_PAGE_STATUS') {
    // The popup is asking if we've found a job. We re-run detection here
    // in case the page content has changed dynamically since load.
    detectAndStoreJobData(); 
    
    sendResponse({
      type: 'PAGE_STATUS_RESPONSE',
      jobDetected: !!detectedJobData,
      jobData: detectedJobData || undefined,
    });
  }
  // Indicate that the response will be sent asynchronously.
  return true;
});


// Initial detection when the script is injected.
detectAndStoreJobData();

console.log('CareerPilot AI content script active.');
