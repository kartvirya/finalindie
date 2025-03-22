import { useState, useEffect } from 'react';

export function EmailPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the email submission
    setIsSubmitted(true);
    setTimeout(() => setIsVisible(false), 2000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-cream p-8 rounded-lg shadow-xl max-w-md w-full mx-4 animate-fade-in">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-accent mb-4">Join Our Gaming Community!</h2>
          {!isSubmitted ? (
            <>
              <p className="text-additional mb-6">Sign up for our mailing list to get the latest indie game recommendations!</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-main rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-accent text-white py-2 px-4 rounded-md hover:bg-additional transition-colors duration-200"
                >
                  Subscribe
                </button>
              </form>
              <button
                onClick={() => setIsVisible(false)}
                className="mt-4 text-sm text-additional hover:text-accent"
              >
                Maybe later
              </button>
            </>
          ) : (
            <div className="text-accent animate-fade-in">
              Thanks for subscribing! 🎮
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 